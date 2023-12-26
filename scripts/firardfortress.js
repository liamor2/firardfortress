import firardFortressActorSheet from "./sheets/firardFortressActorSheets.js";
import firardFortressItemSheet from "./sheets/firardFortressItemSheets.js";

Hooks.once('init', async function() {
    console.log('firardFortress | Initializing firardFortress');


    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("firardFortress", firardFortressActorSheet, { makeDefault: true });


    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("firardFortress", firardFortressItemSheet, { makeDefault: true });
});

Hooks.once('ready', async function() {
    console.log('firardFortress | Ready');

    CONFIG.Combat.initiative = {
        formula: "1d20",
        decimals: 2
    };
});

Hooks.on("createItem", (item) => {
    switch (item.type) {
        case "Weapon":
            item.update({
                "img": "icons/weapons/swords/greatsword-crossguard-steel.webp"
            });
            break;
        case "Equipment":
            item.update({
                "img": "icons/equipment/chest/breastplate-cuirass-steel-grey.webp"
            });
            break;
        case "Misc":
            item.update({
                "img": "icons/containers/bags/pack-leather-black-brown.webp"
            });
            break;
        case "Money":
            item.update({
                "img": "icons/commodities/currency/coin-inset-compass-silver.webp"
            });
            break;
        case "Proficiency":
            item.update({
                "img": "icons/skills/social/intimidation-impressing.webp"
            });
            break;
        case "Spell":
            item.update({
                "img": "icons/magic/fire/explosion-embers-orange.webp"
            });
            break;
        case "Skill":
            item.update({
                "img": "icons/skills/melee/hand-grip-sword-orange.webp"
            });
            break;
        case "Hybrid":
            item.update({
                "img": "icons/magic/unholy/hand-fire-skeleton-pink.webp"
            });
            break;
        case "Transformation":
            item.update({
                "img": "icons/magic/holy/angel-winged-humanoid-blue.webp"
            });
            break;
        case "Passif":
            item.update({
                "img": "icons/magic/perception/eye-ringed-glow-angry-large-red.webp"
            });
            break;
        case "AdventureDice":
            item.update({
                "img": "icons/svg/d4-grey.svg"
            });
            break;
        default:
            break;
    }
});
