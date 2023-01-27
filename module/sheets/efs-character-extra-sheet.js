export default class EFSCharacterExtraSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/efs/templates/sheets/extra-dialog.html",
            height: 600,
            width: 600,
        })
    }

    getData(options) {
        const context = super.getData(options);
        context.data = this.actor._system;
        context.items = this.actor.items;
        return context;
    }
}
