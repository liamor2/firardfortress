import { gsap } from "/scripts/greensock/esm/all.js";
import { Draggable } from "/scripts/greensock/esm/Draggable.js";

gsap.registerPlugin(Draggable);

function registerDraggables() {
  Draggable.create("#marker", {
    type: "x,y",
    bounds: "#marker-container",
    onDrag: updateDOMOnDrag,
  });
}

function updateDOMOnDrag() {
  const lawfulText = document.getElementById("lawful");
  const chaoticText = document.getElementById("chaotic");
  const goodText = document.getElementById("good");
  const evilText = document.getElementById("evil");
  const max = 145;

  gsap.to(lawfulText, {
    opacity: 1 - this.x / max,
    duration: 0.1,
    ease: "power2.inOut",
  });
  gsap.to(chaoticText, {
    opacity: this.x / max,
    duration: 0.1,
    ease: "power2.inOut",
  });
  gsap.to(goodText, {
    opacity: 1 - this.y / max,
    duration: 0.1,
    ease: "power2.inOut",
  });
  gsap.to(evilText, {
    opacity: this.y / max,
    duration: 0.1,
    ease: "power2.inOut",
  });
}

async function registerGlobalAnimations() {
  registerDraggables();
}

async function statBarAnimation(data, oldData, element) {
  oldData = oldData ? oldData.data : null;
  const statList = ["HealthPoints", "ManaPoints", "StaminaPoints", "PhysicalArmor", "MagicalArmor"];

  statList.forEach(stat => {
    const statMax = data.system[stat].max;
    const statValue = data.system[stat].value;
    const statTemp = data.system[stat].temp;
    const oldStatValue = oldData ? oldData.system[stat].value : 0;
    const oldStatTemp = oldData ? oldData.system[stat].temp : 0;
    const statBarValue = element.find(`.${stat}barValue`)[0];
    const statBarTemp = element.find(`.${stat}barTemp`)[0];
    const statBarMax = element.find(`.${stat}bar`)[0];

    if (oldData) {
      const { max: oldStatMax, value: oldStatValue, temp: oldStatTemp } = oldData.system[stat];

      setBarWidth(statBarValue, oldStatValue, oldStatMax);
      setBarWidth(statBarTemp, oldStatTemp, oldStatMax);

      if (oldStatMax === 0) {
        setBarToZero(statBarValue, statBarTemp, statBarMax);
      }
    }

    animateBarWidth(statBarValue, oldStatValue, statValue, statMax);
    animateBarWidth(statBarTemp, oldStatTemp, statTemp, statMax);

    if (statMax === 0) {
      animateBarToZero(statBarValue, statBarTemp, statBarMax);
    }
  });

  if (data.type !== "NPC") {
    animateWeightBar(data, oldData, element);
  }
}

function setBarWidth(bar, value, max) {
  if (value >= 0) {
    bar.style.width = `${(value / max) * 99}%`;
  } else {
    bar.style.width = `${(value / -max) * 99}%`;
  }
}

function setBarToZero(barValue, barTemp, barMax) {
  barValue.style.width = "0%";
  barTemp.style.width = "0%";
  barMax.style.backgroundColor = "#808080";
  barMax.style.opacity = "0.2";
}

function animateBarWidth(bar, oldValue, newValue, max) {
  gsap.fromTo(
    bar,
    { width: `${(oldValue / max) * 99}%` },
    {
      width: `${(newValue / max) * 99}%`,
      delay: 0.1,
      duration: 0.5,
      ease: "power2.inOut",
    }
  );
}

function animateBarToZero(barValue, barTemp, barMax) {
  gsap.to(barValue, {
    delay: 0.1,
    width: "0%",
    duration: 0.5,
    ease: "power2.inOut",
  });
  gsap.to(barTemp, {
    delay: 0.1,
    width: "0%",
    duration: 0.5,
    ease: "power2.inOut",
  });
  gsap.to(barMax, {
    delay: 0.1,
    backgroundColor: "#808080",
    opacity: 0.2,
    duration: 0.5,
    ease: "power2.inOut",
  });
}

function animateWeightBar(data, oldData, element) {
  const { max: maxWeight, value: weightValue, over } = data.system.weight;
  const weightBarValue = element.find(".weightBarValue")[0];
  const oldDataWeight = oldData ? oldData.system.weight : { value: 0, max: maxWeight };

  const initialWidth = `${(oldDataWeight.value / oldDataWeight.max) * 99}%`;
  gsap.set(weightBarValue, { width: initialWidth });

  if (weightValue >= 0) {
    if (over) {
      gsap.to(weightBarValue, {
        delay: 0.1,
        width: "99%",
        backgroundColor: "#991313",
        duration: 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    } else {
      gsap.to(weightBarValue, {
        width: `${(weightValue / maxWeight) * 99}%`,
        delay: 0.1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }
}

async function navBarAnimation() {
  const data = await this.getData();
  if (data.actor.type === "NPC") return;
  const navBar = this.element.find("nav.sheet-tabs")[0];
  const tabList = ["main", "proficiencies", "spells", "notes"];
  const oldActiveLI = navBar.querySelector(".active");
  const oldActiveImg = this.element.find("nav li .active .selector")[0];
  const oldActive = this.element.find(
    `.sheet-body .tab[data-tab="${oldActiveLI.dataset.tab}"]`
  )[0];
  const tabs = this.element.find(".sheet-body .tab");
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i] !== oldActive) {
      tabs[i].style.display = "none";
    }
  }
  setTimeout(() => {
    const activeLI = navBar.querySelector(".active");
    const tabContent = this.element.find(".sheet-body .tab.active")[0];
    const ul = navBar.querySelector("ul");
    const navImg = this.element.find("nav li .active .selector")[0];
    const activeIndex = tabList.indexOf(activeLI.dataset.tab);
    const oldIndex = tabList.indexOf(oldActiveLI.dataset.tab);
    if (tabContent !== oldActive) {
      gsap.to(oldActiveImg, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
      gsap.to(navImg, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
      if (activeIndex < oldIndex) {
        gsap.to(ul, {
          x:
            -activeLI.offsetLeft +
            navBar.offsetWidth / 2 -
            activeLI.offsetWidth / 2,
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.fromTo(
          oldActive,
          {
            opacity: 1,
            scale: 1,
            display: "block",
            x: 0,
          },
          {
            opacity: 0,
            scale: 0,
            display: "none",
            duration: 0.2,
            ease: "power2.inOut",
            x: 1000,
          }
        );
        setTimeout(() => {
          gsap.fromTo(
            tabContent,
            {
              opacity: 0,
              scale: 0,
              display: "none",
              x: -1000,
            },
            {
              opacity: 1,
              scale: 1,
              display: "block",
              duration: 0.2,
              ease: "power2.inOut",
              x: 0,
            }
          );
        }, 200);
      } else {
        gsap.to(ul, {
          x:
            -activeLI.offsetLeft +
            navBar.offsetWidth / 2 -
            activeLI.offsetWidth / 2,
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.fromTo(
          oldActive,
          {
            opacity: 1,
            scale: 1,
            display: "block",
            x: 0,
          },
          {
            opacity: 0,
            scale: 0,
            display: "none",
            duration: 0.2,
            ease: "power2.inOut",
            x: -1000,
          }
        );
        setTimeout(() => {
          gsap.fromTo(
            tabContent,
            {
              opacity: 0,
              scale: 0,
              display: "none",
              x: 1000,
            },
            {
              opacity: 1,
              scale: 1,
              display: "block",
              duration: 0.2,
              ease: "power2.inOut",
              x: 0,
            }
          );
        }, 200);
      }
    }
  }, 1);
}

async function navBarAnimationDefault(data, element) {
  if (data.actor.type === "NPC") return;
  const navBar = element.find("nav.sheet-tabs")[0];
  const tabList = ["main", "proficiencies", "spells", "notes"];
  const activeLI = navBar.querySelector(".active");
  const activeImg = element.find("nav li .active .selector")[0];
  const tabContent = element.find(".sheet-body .tab.active")[0];
  const ul = navBar.querySelector("ul");
  const activeIndex = tabList.indexOf(activeLI.dataset.tab);
  gsap.to(activeImg, {
    opacity: 1,
    duration: 0,
  });
  gsap.to(ul, {
    x:
      -activeLI.offsetLeft +
      navBar.offsetWidth / 2 -
      activeLI.offsetWidth / 2 +
      8,
    duration: 0,
  });
  gsap.fromTo(
    tabContent,
    {
      opacity: 0,
      scale: 0,
      display: "none",
      x: 1000,
    },
    {
      opacity: 1,
      scale: 1,
      display: "block",
      duration: 0,
      x: 0,
    }
  );
}

export {
  registerGlobalAnimations,
  statBarAnimation,
  navBarAnimation,
  navBarAnimationDefault,
}