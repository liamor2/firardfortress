import { gsap } from "/scripts/greensock/esm/all.js";
import { Draggable } from "/scripts/greensock/esm/Draggable.js";

import { handleRoll } from "../logic/roll.js";
import { handleAddItem, handleDeleteItem } from "../logic/actorManager.js";

gsap.registerPlugin(Draggable);

export default class firardFortressActorSheet extends ActorSheet {
  constructor(...args) {
    super(...args);

    this.hasBeenRendered = false;
    this.oldData = null;
  }

  get template() {
    console.log(`Firard Fortress | Loading ${this.actor.type} sheet`);

    return `systems/firardfortress/templates/sheets/actors/${this.actor.type}-sheets.hbs`;
  }

  async getData() {
    const data = super.getData();
    this.dataHasBeenUpdated =
    JSON.stringify(data) !== JSON.stringify(this.oldData);

    return data;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 800,
      height: 880,
      classes: ["firardFortress", "sheet", "item"],
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "main",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  async close(options = {}) {
    this.hasBeenRendered = false;
    this.dataHasBeenUpdated = false;
    this.oldData = null;
    return super.close(options);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // click listeners
    html.find(".rollable").click(handleRoll);
    html.find(".add").click(handleAddItem);
    html.find(".delete").click(handleDeleteItem);
    html.find(".edit-item").click(this._onEditItem.bind(this));
    html.find(".item-checkbox").click(this._onEquipItem.bind(this));
    html.find(".move").click(this._onMove.bind(this));
    html.find(".item").click(this.navBarAnimation.bind(this));

    // hover listeners

    // input listeners
    html.find(".item-input").change(this._onUpdateItem.bind(this));
    document.querySelectorAll('input:not([type="checkbox"])').forEach(inputField => {
      inputField.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          inputField.blur();
        }
      });
    });

    // change listeners

    // submit listeners

    // other listeners
    if (!this.hasBeenRendered || this.dataHasBeenUpdated) {
      this.statBarAnimation();
      this.hasBeenRendered = true;
    }
    this.alignmentAnimation();
    this.navBarAnimationDefault();
    this.registerGlobalAnimations();
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  async _onDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let dataset = element.dataset;
    const data = await this.getData();
    let updateData = {};
    let index = 0;

    switch (dataset.delete) {
      case "Language":
        const language = this.actor.items.get(dataset.id);
        language.delete();
        break;
      case "Spell":
        const spell = this.actor.items.get(dataset.id);
        spell.delete();
        break;
      case "Skill":
        const skill = this.actor.items.get(dataset.id);
        skill.delete();
        break;
      case "Hybrid":
        const hybrid = this.actor.items.get(dataset.id);
        hybrid.delete();
        break;
      case "Transformation":
        const transformation = this.actor.items.get(dataset.id);
        transformation.delete();
        break;
      case "Passif":
        const passif = this.actor.items.get(dataset.id);
        passif.delete();
        break;
      case "Proficiency":
        const proficiency = this.actor.items.get(dataset.id);
        proficiency.delete();
        break;
      case "Weapon":
        const weapon = this.actor.items.get(dataset.id);
        weapon.delete();
        break;
      case "Equipment":
        const equipment = this.actor.items.get(dataset.id);
        equipment.delete();
        break;
      case "Misc":
        const misc = this.actor.items.get(dataset.id);
        misc.delete();
        break;
      case "Money":
        const money = this.actor.items.get(dataset.id);
        money.delete();
        break;
      default:
        console.log("default: " + dataset.delete);
        break;
    }
    this.object.update(updateData);
  }

  _onEditItem(event) {
    const item = this.actor.items.get(event.currentTarget.dataset.id);
    item.sheet.render(true);
  }

  _onUpdateItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.id;
    const item = this.actor.items.get(itemId);
    const field = element.dataset.field;
    const value = element.value;

    return item.update({ [field]: value });
  }

  _onEquipItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const item = this.actor.items.get(element.dataset.id);
    const type = `system.${element.dataset.type}`;
    item.update({ [type]: !item.system[element.dataset.type] });
  }

  _onMove(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    if (dataset.type === "up") {
      this.moveItemUp(dataset, dataset.move);
    } else if (dataset.type === "down") {
      this.moveItemDown(dataset, dataset.move);
    }
  }

  // move item

  async moveItemUp(dataset, type) {
    const data = await this.getData();
    const items = data.items;
    const item = items.find((item) => item._id === dataset.id);
    const itemsOfType = items.filter((item) => item.type === type);
    const index = itemsOfType.findIndex((i) => i._id === item._id);
    if (index > 0) {
      const temp = itemsOfType[index - 1];
      itemsOfType[index - 1] = item;
      itemsOfType[index] = temp;
    }

    const updates = itemsOfType.map((item, index) => ({
      _id: item._id,
      sort: index,
    }));

    this.actor.updateEmbeddedDocuments("Item", updates);

    this.render();
  }

  async moveItemDown(dataset, type) {
    const data = await this.getData();
    const items = data.items;
    const item = items.find((item) => item._id === dataset.id);
    const itemsOfType = items.filter((item) => item.type === type);
    const index = itemsOfType.findIndex((i) => i._id === item._id);
    if (index < itemsOfType.length - 1) {
      const temp = itemsOfType[index + 1];
      itemsOfType[index + 1] = item;
      itemsOfType[index] = temp;
    }

    const updates = itemsOfType.map((item, index) => ({
      _id: item._id,
      sort: index,
    }));

    this.actor.updateEmbeddedDocuments("Item", updates);

    this.render();
  }

  // register draggables
  async registerGlobalAnimations() {
    const data = await this.getData();
    const actor = this.actor;
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
  async statBarAnimation() {
    const data = await this.getData();
    const statList = ["HP", "MP", "SP", "PA", "MA"];
    const oldData = this.oldData;

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
          statBarValue.style.width = `${(oldStatValue / oldStatMax) * 99}%`;
        } else if (oldStatValue < 0) {
          statBarValue.style.width = `${(oldStatValue / -oldStatMax) * 99}%`;
        }
        if (oldStatTemp < oldStatMax) {
          statBarTemp.style.width = `${(oldStatTemp / oldStatMax) * 99}%`;
        } else if (oldStatTemp >= oldStatMax) {
          statBarTemp.style.width = "99%";
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
          width: `${(statValue / statMax) * 99}%`,
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else if (statValue < 0) {
        gsap.to(statBarValue, {
          delay: 0.1,
          width: `${(statValue / -statMax) * 99}%`,
          duration: 0.5,
          backgroundColor: "#000000",
          ease: "power2.inOut",
        });
      }
      if (statTemp < statMax) {
        gsap.to(statBarTemp, {
          delay: 0.1,
          width: `${(statTemp / statMax) * 99}%`,
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else if (statTemp >= statMax) {
        gsap.to(statBarTemp, {
          delay: 0.1,
          width: "99%",
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

        if (
          oldWeight.value >= 0 &&
          (oldWeight.value / oldMaxWeight) * 99 <= 99
        ) {
          weightBarValue.style.width = `${
            (oldWeight.value / oldMaxWeight) * 99
          }%`;
        } else if (
          oldWeight.value < 0 &&
          (oldWeight.value / -oldMaxWeight) * 99 <= 99
        ) {
          weightBarValue.style.width = "99%";
        }

        if (oldWeight.value === 0) {
          weightBarValue.style.width = "0%";
        }
      }

      if (weight.value >= 0) {
        if (weight.over) {
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
            delay: 0.1,
            width: `${(weight.value / maxWeight) * 99}%`,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }
    }

    this.oldData = data;
  }

  // alignment animation
  async alignmentAnimation() {
    const data = await this.getData();

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
  async navBarAnimation() {
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

  // navigation bar animations default
  async navBarAnimationDefault() {
    const data = await this.getData();
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
}
