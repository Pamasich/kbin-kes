/* globals describe, it, beforeEach */ 

import assert from "assert";
import { setup } from "./api.mjs";

/** @type {Document} */
let document = undefined;

describe ("alt-all-content-access", function () {
    beforeEach (async function () {
        document = await setup("alt-all-content-access", "AlternativeAllContentAccessMod");
    })

    describe ("setButtonVisibility", function () {
        it ("shouldAbortIfSettingIsTurnedOff", function () {
            document.mod.getHideButtonSetting = () => false;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => dummyButton;
            document.mod.setButtonVisibility (true);
            assert.ok(dummyButton.style.display != "none");
        })
    })
})