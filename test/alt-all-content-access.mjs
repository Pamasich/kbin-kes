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
        it ("should abort if the setting is turned off", function () {
            document.mod.getHideButtonSetting = () => false;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => dummyButton;
            document.mod.setButtonVisibility (true);
            assert.notEqual(dummyButton.style.display, "none");
        })

        it ("should hide the button if the mod is active", function () {
            document.mod.getHideButtonSetting = () => true;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => dummyButton;
            document.mod.setButtonVisibility (true);
            assert.equal(dummyButton.style.display, "none");
        })

        it ("should reset the button if the mod is turned off", function () {
            document.mod.getHideButtonSetting = () => true;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => dummyButton;
            document.mod.setButtonVisibility (false);
            assert.equal(dummyButton.style.display, "");
        })
    })
})