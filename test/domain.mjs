import assert from "assert";
import { describe, it } from "mocha";
import { loadPage } from "./api.mjs";

describe("domain portion", function () {
    this.timeout(10000);
    this.slow(1000);

    it ("still links to the article url", async function () {
        // https://github.com/Pamasich/kbin-kes/issues/20
        // This test is meant to check if that feature still isn't needed
        let document = await loadPage("https://kbin.social/m/world@lemmy.world");
        const domain = document.querySelector(".entry__domain");
        /** @type {HTMLElement} */
        let title = domain.previousElementSibling;
        document = await loadPage(`https://kbin.social${title.getAttribute("href")}`);
        title = document.querySelector(".section--top > header a");
        assert.equal(title.getAttribute("href"), domain.children[0].getAttribute("href"));
    })
})