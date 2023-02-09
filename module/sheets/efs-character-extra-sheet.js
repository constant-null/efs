export default class EFSCharacterExtraSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/efs/templates/sheets/extra-dialog.html",
            height: 600,
            width: 600,
        })
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".edit-item").click(this._onEditItem.bind(this))
        html.find(".delete-item").click(this._onDeleteItem.bind(this))
        html.find(".add-item").click(this._onAddItem.bind(this))
    }


    _onEditItem(event) {
        event.preventDefault();

        const item = this.actor.getEmbeddedDocument("Item", event.target.dataset.id);
        if (!item) {
            return;
        }
        item.sheet.render(true);
    }

    async _onDeleteItem(event) {
        event.preventDefault();
        const itemId = event.target.dataset.id;
        const item = this.actor.getEmbeddedDocument("Item", itemId);

        new Dialog({
            title: game.i18n.localize("EFS.Dialog.ActionConfirm"),
            content: game.i18n.localize("EFS.Dialog.ConfirmDeletion")+"<b>"+item.name+"</b>?",
            buttons: {
                yes: {
                    label: game.i18n.localize("EFS.Dialog.Yes"),
                    callback: () => {this.actor.deleteEmbeddedDocuments("Item", [event.target.dataset.id])},
                },
                no: {
                    label: game.i18n.localize("EFS.Dialog.No"),
                    callback: () => {}
                }
            }
        }).render(true);
    }

    async _onAddItem(event) {
        event.preventDefault();
        const items = await this.actor.createEmbeddedDocuments("Item", [{name:game.i18n.localize("EFS.Item.DefaultName"), type:"item"}])
        await items[0].sheet.render(true);
    }

    getData(options) {
        const context = super.getData(options);
        context.data = this.actor._system;
        context.items = this.actor.items;
        return context;
    }
}
