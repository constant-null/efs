export default class EFSCharacterSheet extends ActorSheet {
    heroic = false;
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/efs/templates/sheets/efs-character-sheet.html",
            height: 460,
            width: 435,
        })
    }

    activateListeners(html) {
        super.activateListeners(html)

        html.find(".clickable").click(this._approachClicked.bind(this));
        html.find(".heroic-mode").click(this._heroicModeClicked.bind(this));
    }

    _heroicModeClicked(event) {
        event.preventDefault();

        this.heroic = !this.heroic;
        this.render();
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

        const diceSteps = ["6", "8", "10", "12", "20"];

        const id = event.currentTarget.id;
        let diceSize = this.actor._data.approaches[id];
        if (this.heroic) {
            diceSize = diceSteps[diceSteps.indexOf(diceSize)+1]
        }
        let r = await new Roll("1d" + diceSize).evaluate({async: true});

        let heroMessage = game.i18n.localize("EFS.Message.Uses") + " <b>" + game.i18n.localize("EFS.Approaches." + id.charAt(0).toUpperCase() + id.slice(1)) + "</b> " + game.i18n.localize("EFS.Approaches.Singular").toLowerCase()
        if (this.heroic) {
            heroMessage = game.i18n.localize("EFS.Message.InHeroicMoment") + "<br/>" + heroMessage;
        }

        await r.toMessage({
            flavor: heroMessage,
            speaker: ChatMessage.getSpeaker({actor: this.actor})
        });
    }

    getData(options) {
        const context = super.getData(options);
        context.actor = this.actor;
        context.data = this.actor._data;
        context.heroic = this.heroic;
        return context
    }
}