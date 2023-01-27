import EFSCharacterExtraSheet from "./efs-character-extra-sheet.js";

export default class EFSNPCSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/efs/templates/sheets/efs-npc-sheet.html",
            height: 230,
            width: 435,
        })
    }

    activateListeners(html) {
        super.activateListeners(html)

        html.find(".clickable.approach").click(this._approachClicked.bind(this));
        html.find(".clickable#extra").click(this._showExtra.bind(this));
    }

    async _showExtra(event) {
        new EFSCharacterExtraSheet(this.actor).render(true);
    }

    async _onSubmit(event, options) {
        const formData = this._getSubmitData({});

        formData["data.dp.value"] = formData["data.dp.max"] - formData["data.defeatPoints"]

        options = options || {};
        options.updateData = formData;
        await super._onSubmit(event, options);
    }

    async _approachClicked(event) {
        event.preventDefault();

        const id = event.currentTarget.id;
        const diceSize = this.actor._system.approaches[id];
        let r = new Roll("1d" + diceSize);

        await r.evaluate({async: true});

        const heroMessage = game.i18n.localize("EFS.Message.Uses") + " <b>" + game.i18n.localize("EFS.Approaches.Action").toLowerCase()
        await r.toMessage({
            flavor: heroMessage,
            speaker: ChatMessage.getSpeaker({actor: this.actor})
        });
    }

    getData(options) {
        const context = super.getData(options);
        context.actor = this.actor;
        context.data = this.actor._system;

        return context
    }
}