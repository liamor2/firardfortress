import { gsap } from "/scripts/greensock/esm/all.js";
import { Draggable } from "/scripts/greensock/esm/Draggable.js";

gsap.registerPlugin(Draggable);

// register draggables
async function registerGlobalAnimations(data, actor) {
  // const data = await this.getData();
  // const actor = this.actor;
  Draggable.create("#marker", {
    type: "x,y",
    bounds: "#marker-container",
    onDrag: function () {
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
    },
    onDragEnd: function () {
      const alignment = data.data.system.alignment;

      alignment.x = this.x;
      alignment.y = this.y;

      actor.update({ "system.alignment": alignment });
    },
  });
}

// stat bar animations
async function statBarAnimation(data, oldDAta) {
  // const data = await this.getData();
  const statList = ["HP", "MP", "SP", "PA", "MA"];
  // const oldData = this.oldData;

  for (let i = 0; i < statList.length; i++) {
    const stat = statList[i];
    const statMax = data.data.system[stat].max;
    const statValue = data.data.system[stat].value;
    const statTemp = data.data.system[stat].temp;
    const statBarValue = this.element.find(`.${stat}barValue`)[0];
    const statBarTemp = this.element.find(`.${stat}barTemp`)[0];
    const statBarMax = this.element.find(`.${stat}bar`)[0];

    if (oldData !== null) {
      const oldStatMax = oldData.data.system[stat].max;
      const oldStatValue = oldData.data.system[stat].value;
      const oldStatTemp = oldData.data.system[stat].temp;

      if (oldStatValue >= 0) {
        statBarValue.style.width = `${(oldStatValue / oldStatMax) * 100}%`;
      } else if (oldStatValue < 0) {
        statBarValue.style.width = `${(oldStatValue / -oldStatMax) * 100}%`;
      }
      if (oldStatTemp < oldStatMax) {
        statBarTemp.style.width = `${(oldStatTemp / oldStatMax) * 100}%`;
      } else if (oldStatTemp >= oldStatMax) {
        statBarTemp.style.width = "100%";
      }
      if (oldStatMax === 0) {
        statBarValue.style.width = "0%";
        statBarTemp.style.width = "0%";
        statBarMax.style.backgroundColor = "#808080";
        statBarMax.style.opacity = "0.2";
      }
    }

    if (statValue >= 0) {
      gsap.to(statBarValue, {
        delay: 0.1,
        width: `${(statValue / statMax) * 100}%`,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else if (statValue < 0) {
      gsap.to(statBarValue, {
        delay: 0.1,
        width: `${(statValue / -statMax) * 100}%`,
        duration: 0.5,
        backgroundColor: "#000000",
        ease: "power2.inOut",
      });
    }
    if (statTemp < statMax) {
      gsap.to(statBarTemp, {
        delay: 0.1,
        width: `${(statTemp / statMax) * 100}%`,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else if (statTemp >= statMax) {
      gsap.to(statBarTemp, {
        delay: 0.1,
        width: "100%",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
    if (statMax === 0) {
      gsap.to(statBarValue, {
        delay: 0.1,
        width: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      });
      gsap.to(statBarTemp, {
        delay: 0.1,
        width: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      });
      gsap.to(statBarMax, {
        delay: 0.1,
        backgroundColor: "#808080",
        opacity: 0.2,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }

  if (data.actor.type !== "NPC") {
    const weight = data.data.system.weight;
    const maxWeight = weight.max;
    const weightBarMax = this.element.find(".weightBar")[0];
    const weightBarValue = this.element.find(".weightBarValue")[0];

    if (oldData !== null) {
      const oldWeight = oldData.data.system.weight;
      const oldMaxWeight = oldWeight.max;

      if (oldMaxWeight === 0) {
        weightBarValue.style.width = "0%";
        weightBarMax.style.backgroundColor = "#808080";
        weightBarMax.style.opacity = "0.2";
      }

      if (oldWeight.value >= 0 && (oldWeight.value / oldMaxWeight) * 100 <= 100) {
        weightBarValue.style.width = `${(oldWeight.value / oldMaxWeight) * 100}%`;
      } else if (oldWeight.value < 0 && (oldWeight.value / -oldMaxWeight) * 100 <= 100) {
        weightBarValue.style.width = "100%";
      }

      if (oldWeight.value === 0) {
        weightBarValue.style.width = "0%";
      }
    }

    if (weight.value >= 0) {
      if (weight.over) {
        gsap.to(weightBarValue, {
          delay: 0.1,
          width: "100%",
          backgroundColor: "#991313",
          duration: 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      } else {
        gsap.to(weightBarValue, {
          delay: 0.1,
          width: `${(weight.value / maxWeight) * 100}%`,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    }
  }

  this.oldData = data;
}

// alignment animation
async function alignmentAnimation(data) {
  // const data = await this.getData();

  if (data.actor.type === "NPC") return;
  const alignment = data.data.system.alignment;
  const position = {
    x: alignment.x,
    y: alignment.y,
  };
  const max = 145;
  const alignmentMarker = this.element.find("#marker")[0];
  const lawfulText = this.element.find("#lawful")[0];
  const chaoticText = this.element.find("#chaotic")[0];
  const goodText = this.element.find("#good")[0];
  const evilText = this.element.find("#evil")[0];

  gsap.to(alignmentMarker, {
    x: position.x,
    y: position.y,
    duration: 0,
  });

  gsap.to(lawfulText, {
    opacity: 1 - position.x / max,
    duration: 0,
  });
  gsap.to(chaoticText, {
    opacity: position.x / max,
    duration: 0,
  });
  gsap.to(goodText, {
    opacity: 1 - position.y / max,
    duration: 0,
  });
  gsap.to(evilText, {
    opacity: position.y / max,
    duration: 0,
  });
}

// navigation bar animations
async function navBarAnimation(data) {
  // const data = await this.getData();
  if (data.actor.type === "NPC") return;
  const navBar = this.element.find("nav.sheet-tabs")[0];
  const tabList = ["main", "proficiencies", "spells", "notes"];
  const oldActiveLI = navBar.querySelector(".active");
  const oldActiveImg = this.element.find("nav li .active .selector")[0];
  const oldActive = this.element.find(`.sheet-body .tab[data-tab="${oldActiveLI.dataset.tab}"]`)[0];
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
          x: -activeLI.offsetLeft + navBar.offsetWidth / 2 - activeLI.offsetWidth / 2,
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
          x: -activeLI.offsetLeft + navBar.offsetWidth / 2 - activeLI.offsetWidth / 2,
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

// navigation bar animations default
async function navBarAnimationDefault(data) {
  // const data = await this.getData();
  if (data.actor.type === "NPC") return;
  const navBar = this.element.find("nav.sheet-tabs")[0];
  const tabList = ["main", "proficiencies", "spells", "notes"];
  const activeLI = navBar.querySelector(".active");
  const activeImg = this.element.find("nav li .active .selector")[0];
  const tabContent = this.element.find(".sheet-body .tab.active")[0];
  const ul = navBar.querySelector("ul");
  const activeIndex = tabList.indexOf(activeLI.dataset.tab);
  gsap.to(activeImg, {
    opacity: 1,
    duration: 0,
  });
  gsap.to(ul, {
    x: -activeLI.offsetLeft + navBar.offsetWidth / 2 - activeLI.offsetWidth / 2 + 8,
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
  alignmentAnimation,
  navBarAnimation,
  navBarAnimationDefault,
}