export default class EFSItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/efs/templates/sheets/efs-item-sheet.html",
            height: 460,
            width: 500,
        })
    }

    getData(options) {
        const context = super.getData(options);
        context.item = this.item;
        context.data = this.item._system;

        return context;
    }
}