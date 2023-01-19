export default class EFSCharacter extends Actor {
    static async create(data, options) {
        const subtype = options?.subtype || "character";
        data.token = {
            actorLink: subtype === "character",
            disposition: subtype === "character" ? 1 : -1,
            vision: true,
            bar1: { attribute: "dp" },
        }

        if (subtype === "npc") {
            data.flags = { "core": { "sheetClass": "efs.NPCCharacterSheet" } };
        }

        await super.create(data, options)
    }

    prepareData() {
        super.prepareData();
        this.data.data.defeatPoints = this.data.data.dp.max - this.data.data.dp.value;
    }
}