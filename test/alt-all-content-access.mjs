import assert from "assert";
import { describe, it, beforeEach } from "mocha";
import { setup } from "./api.mjs";

const modId = "alt-all-content-access";
const modClass = "AlternativeAllContentAccessMod";

describe ("alt-all-content-access", function () {
    this.timeout(10000);
    this.slow(1000);

    beforeEach (async function () {
        this.document = await setup(modId, modClass);
        this.mod = this.document.mod;
    })

    describe ("setButtonVisibility", function () {
        it ("should hide the button while the setting is turned on", function () {
            this.mod.getHideButtonSetting = () => true;
            const dummyButton = this.document.createElement("a");
            this.document.createElement("div").appendChild(dummyButton);
            this.mod.getAllContentButton = () => [dummyButton];
            this.mod.setButtonVisibility(true);
            assert.equal(dummyButton.parentNode.style.display, "none");
        })
        it ("should show the button again after the setting has been turned off", function () {
            this.mod.getHideButtonSetting = () => true;
            const dummyButton = this.document.createElement("a");
            this.document.createElement("div").appendChild(dummyButton);
            this.mod.getAllContentButton = () => [dummyButton];
            this.mod.setButtonVisibility(true);
            this.mod.getHideButtonSetting = () => false;
            this.mod.setButtonVisibility(true);
            assert.notEqual(dummyButton.parentNode.style.display, "none");
        })
        it ("should show the button again after the mod is disabled", function () {
            this.mod.getHideButtonSetting = () => true;
            const dummyButton = this.document.createElement("a");
            this.document.createElement("div").appendChild(dummyButton);
            this.mod.getAllContentButton = () => [dummyButton];
            this.mod.setButtonVisibility(true);
            this.mod.setButtonVisibility(false);
            assert.equal(dummyButton.parentNode.style.display, "");
        })
    })

    describe ("getTitle", function () {
        it ("still retrieves the correct elements", async function () {
            const document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
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
            const document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
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
            const document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
            /** @type {HTMLElement} */
            const buttonList = document.mod.getAllContentButton();
            assert.ok(buttonList.length == 2);
            buttonList.forEach((button) => {
                assert.equal(button.getAttribute("href"), "/*/m/kbinMeta");
                assert.equal(button.parentElement.nodeName, "LI");
            });
        })
        it ("still retrieves the correct elements when run multiple times", async function () {
            const document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
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
            const title = this.document.createElement("a");
            title.setAttribute("href", "/m/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = () => null;
            this.mod.isCurrentViewCollection = () => false;
            this.mod.setup();
            assert.equal(title.getAttribute("href"), "/*/m/example");
        })
        it ("changes the magazine title's link correctly when run multiple times", function () {
            const title = this.document.createElement("a");
            title.setAttribute("href", "/m/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = () => null;
            this.mod.isCurrentViewCollection = () => false;
            this.mod.setup();
            this.mod.setup();
            assert.equal(title.getAttribute("href"), "/*/m/example");
        })
        it ("changes the collection title's link correctly", function () {
            const title = this.document.createElement("a");
            title.setAttribute("href", "/c/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = () => null;
            this.mod.isCurrentViewCollection = () => true;
            this.mod.setup();
            assert.equal(title.getAttribute("href"), "/c/example/*");
        })
        it ("changes the collection title's link correctly when run multiple times", function () {
            const title = this.document.createElement("a");
            title.setAttribute("href", "/c/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = () => null;
            this.mod.isCurrentViewCollection = () => true;
            this.mod.setup();
            this.mod.setup();
            assert.equal(title.getAttribute("href"), "/c/example/*");
        })
        it ("calls the setButtonVisibility function", function () {
            let called = undefined;
            const title = this.document.createElement("a");
            title.setAttribute("href", "/m/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = (isActive) => called = isActive;
            this.mod.isCurrentViewCollection = () => false;
            this.mod.setup();
            assert.equal(called, true);
        })
        it ("works in practice", async function () {
            const document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
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
                assert.ok(button.parentNode.style.display == "none");
            })
        })
        it ("can handle pages that lack the title (like /all)", function () {
            this.mod.getHideButtonSetting = () => true;
            this.mod.setup();
        })
        it ("works with collections (/c/)", async function () {
            const document = await setup(modId, modClass, "https://kbin.social/c/kbin");
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
                assert.ok(button.parentNode.style.display == "none");
            })
        })
    })

    describe ("teardown", function () {
        it ("restores the original magazine title", function () {
            const title = this.document.createElement("a");
            title.setAttribute("href", "/m/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = () => null;
            this.mod.isCurrentViewCollection = () => false;
            // to check that we actually get the original one back, setup needs to be run first
            this.mod.setup(); 
            this.mod.teardown();
            assert.equal(title.getAttribute("href"), "/m/example");
        })
        it ("restores the original collection title", function () {
            const title = this.document.createElement("a");
            title.setAttribute("href", "/c/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = () => null;
            this.mod.isCurrentViewCollection = () => true;
            // to check that we actually get the original one back, setup needs to be run first
            this.mod.setup(); 
            this.mod.teardown();
            assert.equal(title.getAttribute("href"), "/c/example");
        })
        it ("calls the setButtonVisibility function", function () {
            let called = undefined;
            const title = this.document.createElement("a");
            title.setAttribute("href", "/m/example");
            this.mod.getTitle = () => [title];
            this.mod.setButtonVisibility = (isActive) => called = isActive;
            this.mod.teardown();
            assert.equal(called, false);
        })
        it ("works in practice", async function () {
            const document = await setup(modId, modClass, "https://kbin.social/m/kbinmeta");
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
            const document = await setup(modId, modClass, "https://kbin.social/c/kbin");
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