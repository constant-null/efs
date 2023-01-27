import EFSCharacter from "./module/efs-character.js";
import EFSCharacterSheet from "./module/sheets/efs-character-sheet.js";
import EFSNPCSheet from "./module/sheets/efs-npc-sheet.js";

Hooks.once("init", function () {
    console.log("EFS | Initializing Epic Fail System");

    CONFIG.Actor.documentClass = EFSCharacter;
    CONFIG.debug.hooks = true;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("efs", EFSCharacterSheet, { makeDefault: true, label: "EFS.Sheets.Character" });
    Actors.registerSheet("efs", EFSNPCSheet, { label: "EFS.Sheets.NPC" });
});

Hooks.on("renderCameraViews", function (app, html, data){
    const cameraGM = html.find("span:contains('GM')");
    cameraGM.text(game.i18n.localize("EFS.Narator"));
});

Hooks.on("renderPlayerList", function (app, html, data){
    const cameraGM = html.find("span:contains('GM')");
    cameraGM.text(cameraGM.text().replace('GM', game.i18n.localize("EFS.Narator")));
});
