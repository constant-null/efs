export default class EFSCharacter extends Actor {
    static async create(data, options) {
        const subtype = options?.subtype || "character";
        data.token = {
            actorLink: subtype === "character",
            disposition: subtype === "character" ? 1 : -1,
            vision: subtype === "character",
            displayBars: 40,
            bar1: { attribute: "dp" },
        }

        if (subtype === "npc") {
            data.flags = { "core": { "sheetClass": "efs.EFSNPCSheet" } };
        }

        await super.create(data, options)
    }

    static async createDialog(data = {}, { parent = null, pack = null, ...options } = {}) {
        // Collect data
        const documentName = this.metadata.name;
        const types = ["character", "npc"];
        const typeNames = {
            "character": "EFS.Sheets.Character",
            "npc": "EFS.Sheets.NPC",
        }
        const folders = parent ? [] : game.folders.filter(f => (f.data.type === documentName) && f.displayed);
        const label = game.i18n.localize(this.metadata.label);
        const title = game.i18n.format("DOCUMENT.Create", { type: label });

        // Render the document creation form
        const html = await renderTemplate(`templates/sidebar/document-create.html`, {
            name: data.name || game.i18n.format("DOCUMENT.New", { type: label }),
            folder: data.folder,
            folders: folders,
            hasFolders: folders.length >= 1,
            type: data.type || types[0],
            types: types.reduce((obj, t) => {
                obj[t] = game.i18n.localize(typeNames[t]);
                return obj;
            }, {}),
            hasTypes: types.length > 1
        });

        // Render the confirmation dialog window
        return Dialog.prompt({
            title: title,
            content: html,
            label: title,
            callback: html => {
                const form = html[0].querySelector("form");
                const fd = new FormDataExtended(form);
                foundry.utils.mergeObject(data, fd.toObject(), { inplace: true });
                if (!data.folder) delete data["folder"];
                const subtype = data.type;
                data.type = 'character';
                return this.create(data, { parent, pack, renderSheet: true, subtype });
            },
            rejectClose: false,
            options: options
        });
    }

    prepareData() {
        super.prepareData();
        this._system.defeatPoints = this._system.dp.max - this._system.dp.value;
    }

    get _system() {
        const v10 = game.release.generation >= 10;
        if (v10) {
            return this.system;
        } else {
            return this.data.data;
        }
    }
}