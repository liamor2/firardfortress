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
