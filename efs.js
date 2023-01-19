import EFSCharacter from "./module/efs-character.js";
import EFSCharacterSheet from "./module/sheets/efs-character-sheet.js";

Hooks.once("init", function () {
    console.log("EFS | Initializing Epic Fail System");

    CONFIG.Actor.documentClass = EFSCharacter;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("efs", EFSCharacterSheet)
});
