export default class EFSCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        let tpl;
        if (this.actor.data.type === "character") {
            tpl = "systems/efs/templates/sheets/efs-character-sheet.html";
        } else {
            tpl = "systems/efs/templates/sheets/efs-npc-sheet.html";
        }

        return mergeObject(super.defaultOptions, {
            template: tpl,
            height: 460,
            width: 435,
        })
    }

    activateListeners(html) {
        super.activateListeners(html)

        html.find(".clickable").click(this._approachClicked.bind(this));
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
        const diceSize = this.actor.data.data.approaches[id];
        let r = new Roll("1d" + diceSize);

        await r.evaluate({async: true});

        const heroMessage = game.i18n.localize("EFS.Message.Uses") + " <b>" + game.i18n.localize("EFS.Approaches." + id.charAt(0).toUpperCase() + id.slice(1)) + "</b> " + game.i18n.localize("EFS.Approaches.Singular").toLowerCase()
        await r.toMessage({
            flavor: heroMessage,
            speaker: ChatMessage.getSpeaker({actor: this.actor})
        });
    }

    getData(options) {
        const context = super.getData(options);
        context.actor = this.actor;
        context.data = this.actor.data;

        return context
    }
}