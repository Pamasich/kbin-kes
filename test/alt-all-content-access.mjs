/* globals describe, it, beforeEach */ 

import assert from "assert";
import RandExp from "randexp";
import { setup } from "./api.mjs";

/** @type {Document} */
let document = undefined;

function stubHideButtonSetting (return_value) {
    document.mod.getHideButtonSetting = function () { return return_value; }
}

describe ("alt-all-content-access", function () {
    beforeEach (async function () {
        document = await setup("alt-all-content-access", "AlternativeAllContentAccessMod");
    });

    describe ("setButtonVisibility", function () {
        
    })

    describe ("setup", function () {

    })

    describe ("teardown", function () {
        
    })
})