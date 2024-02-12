import assert from "assert";
import { describe, it, beforeEach } from "mocha";
import { setup } from "./api.mjs";

/** @type {Document} */
let document = undefined;

const modId = "alt-all-content-access";
const modClass = "AlternativeAllContentAccessMod";

describe ("alt-all-content-access", function () {
    beforeEach (async function () {
        document = await setup(modId, modClass);
    })

    describe ("setButtonVisibility", function () {
        it ("should hide the button while the setting is turned on", function () {
            document.mod.getHideButtonSetting = () => true;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => [dummyButton];
            document.mod.setButtonVisibility(true);
            assert.equal(dummyButton.style.display, "none");
        })
        it ("should show the button again after the setting has been turned off", function () {
            document.mod.getHideButtonSetting = () => true;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => [dummyButton];
            document.mod.setButtonVisibility(true);
            document.mod.getHideButtonSetting = () => false;
            document.mod.setButtonVisibility(true);
            assert.notEqual(dummyButton.style.display, "none");
        })
        it ("should show the button again after the mod is disabled", function () {
            document.mod.getHideButtonSetting = () => true;
            const dummyButton = document.createElement("div");
            document.mod.getAllContentButton = () => [dummyButton];
            document.mod.setButtonVisibility(true);
            document.mod.setButtonVisibility(false);
            assert.equal(dummyButton.style.display, "");
        })
    })

    describe ("getTitle", function () {
        it ("still retrieves the correct elements", async function () {
            document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            /** @type {HTMLElement} */
            const titleList = document.mod.getTitle();
            assert.ok(titleList.length == 2);
            titleList.forEach((title) => {
                const prefix = title.parentElement.querySelector("span").innerHTML;
                assert.equal(prefix, "/m/");
                assert.equal(title.getAttribute("href"), "/m/kbinMeta");
            });
        })
        it ("still retrieves the correct elements when run multiple times", async function () {
            document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            document.mod.getHideButtonSetting = () => true;
            document.mod.setup();
            /** @type {HTMLElement} */
            let titleList = document.mod.getTitle();
            assert.ok(titleList.length == 2);
            titleList.forEach((title) => {
                const prefix = title.parentElement.querySelector("span").innerHTML;
                assert.equal(prefix, "/m/");
                assert.equal(title.getAttribute("href"), "/*/m/kbinMeta");
            });
        })
    })

    describe ("getAllContentButton", function () {
        it ("still retrieves the correct elements", async function () {
            document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            /** @type {HTMLElement} */
            const buttonList = document.mod.getAllContentButton();
            assert.ok(buttonList.length == 2);
            buttonList.forEach((button) => {
                assert.equal(button.getAttribute("href"), "/*/m/kbinMeta");
                assert.equal(button.parentElement.nodeName, "LI");
            });
        })
        it ("still retrieves the correct elements when run multiple times", async function () {
            document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            document.mod.getHideButtonSetting = () => true;
            document.mod.setup();
            /** @type {HTMLElement} */
            const buttonList = document.mod.getAllContentButton();
            assert.ok(buttonList.length == 2);
            buttonList.forEach((button) => {
                assert.equal(button.getAttribute("href"), "/*/m/kbinMeta");
                assert.equal(button.parentElement.nodeName, "LI");
            });
        })
    })

    describe ("setup", function () {
        it ("changes the magazine title's link correctly", function () {
            const title = document.createElement("a");
            title.setAttribute("href", "/m/example");
            document.mod.getTitle = () => [title];
            document.mod.setButtonVisibility = () => null;
            document.mod.setup();
            assert.equal(title.getAttribute("href"), "/*/m/example");
        })
        it ("changes the magazine title's link correctly when run multiple times", function () {
            const title = document.createElement("a");
            title.setAttribute("href", "/m/example");
            document.mod.getTitle = () => [title];
            document.mod.setButtonVisibility = () => null;
            document.mod.setup();
            document.mod.setup();
            assert.equal(title.getAttribute("href"), "/*/m/example");
        })
        it ("calls the setButtonVisibility function", function () {
            let called = undefined;
            const title = document.createElement("a");
            title.setAttribute("href", "/m/example");
            document.mod.getTitle = () => [title];
            document.mod.setButtonVisibility = (isActive) => called = isActive;
            document.mod.setup();
            assert.equal(called, true);
        })
        it ("works in practice", async function () {
            document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            document.mod.getHideButtonSetting = () => true;
            document.mod.setup();
            const titleList = document.mod.getTitle();
            assert.ok(titleList.length == 2);
            titleList.forEach((title) => {
                assert.ok(title.getAttribute("href").startsWith("/*/"));
            })
            const buttonList = document.mod.getAllContentButton();
            assert.ok(buttonList.length == 2);
            buttonList.forEach((button) => {
                assert.ok(button.style.display == "none");
            })
        })
        it ("can handle pages that lack the title (like /all)", async function () {
            document.mod.getHideButtonSetting = () => true;
            document.mod.setup();
        })
        it ("works with collections (/c/)", async function () {
            document = await setup(modId, modClass, "https://kbin.social/c/kbin");
            document.mod.getHideButtonSetting = () => true;
            document.mod.setup();
            const titleList = document.mod.getTitle();
            assert.ok(titleList.length == 2);
            titleList.forEach((title) => {
                assert.ok(title.getAttribute("href").endsWith("/*"));
            })
            const buttonList = document.mod.getAllContentButton();
            assert.ok(buttonList.length == 2);
            buttonList.forEach((button) => {
                assert.ok(button.style.display == "none");
            })
        })
    })

    describe ("teardown", function () {
        it ("restores the original magazine title", function () {
            const title = document.createElement("a");
            title.setAttribute("href", "/m/example");
            document.mod.getTitle = () => [title];
            document.mod.setButtonVisibility = () => null;
            // to make sure we actually get the original one back, setup needs to be run first
            document.mod.setup(); 
            document.mod.teardown();
            assert.equal(title.getAttribute("href"), "/m/example");
        })
        it ("calls the setButtonVisibility function", function () {
            let called = undefined;
            const title = document.createElement("a");
            title.setAttribute("href", "/m/example");
            document.mod.getTitle = () => [title];
            document.mod.setButtonVisibility = (isActive) => called = isActive;
            document.mod.teardown();
            assert.equal(called, false);
        })
        it ("works in practice", async function () {
            document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            document.mod.getHideButtonSetting = () => true;
            const titleList = document.mod.getTitle();
            const buttonList = document.mod.getAllContentButton();
            assert.ok(titleList.length == 2);
            assert.ok(buttonList.length == 2);
            const originalLink = titleList[0].getAttribute("href");
            const originalStyle = buttonList[0].style.display;
            document.mod.setup();
            document.mod.teardown();
            titleList.forEach((title) => {
                assert.equal(title.getAttribute("href"), originalLink);
            })
            buttonList.forEach((button) => {
                assert.equal(button.style.display, originalStyle);
            })
        })
        it ("restores correctly on collection pages", async function () {
            document = await setup(modId, modClass, "https://kbin.social/c/kbin");
            document.mod.getHideButtonSetting = () => true;
            const titleList = document.mod.getTitle();
            const buttonList = document.mod.getAllContentButton();
            assert.ok(titleList.length == 2);
            assert.ok(buttonList.length == 2);
            const originalLink = titleList[0].getAttribute("href");
            const originalStyle = buttonList[0].style.display;
            document.mod.setup();
            document.mod.teardown();
            titleList.forEach((title) => {
                assert.equal(title.getAttribute("href"), originalLink);
            })
            buttonList.forEach((button) => {
                assert.equal(button.style.display, originalStyle);
            })
        })
    })
})