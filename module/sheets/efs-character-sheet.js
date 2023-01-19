export default class EFSCharacterSheet extends ActorSheet {
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
    }

    async _approachClicked(event) {
        event.preventDefault();

        const id = event.currentTarget.id;
        const diceSize = this.actor.data.data.approaches[id];
        let r = new Roll("1d"+diceSize);

        await r.evaluate({async: true});
        await r.toMessage({
            flavor: game.i18n.localize("EFS.Message.Uses") +" <b>"+game.i18n.localize("EFS.Approaches."+id.charAt(0).toUpperCase() + id.slice(1))+ "</b> "+game.i18n.localize("EFS.Approaches.Singular").toLowerCase(),
            speaker: ChatMessage.getSpeaker({ actor: this.actor })
        });
    }

    getData(options) {
        const context = super.getData(options);
        context.actor = this.actor;
        context.data = this.actor.data;

        return context
    }
}