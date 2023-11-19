export default class firardFortressItemSheet extends ItemSheet {
    get template() {
        console.log(`firardFortress | Loading ${this.item.type} sheet`);

        return `systems/firardfortress/templates/sheets/items/${this.item.type}-sheet.hbs`;
    }

    async getData() {
        const data = super.getData();
        data.config = CONFIG.firardFortress;
        return data;
    }
}