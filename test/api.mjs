/* globals process */

import { JSDOM } from "jsdom";

/** @param {String} mod @param {String} main_function */
export async function setup (mod, main_function) {
    const html = 
            `<script src="file:${process.cwd()}/mods/${mod}/${mod}.user.js"></script>`
        +   `<script>document.mod = new ${main_function}();</script>`;
    const jsdom = new JSDOM( html, { runScripts: "dangerously", resources: "usable" } );
    await new Promise((resolve) => jsdom.window.addEventListener("load", resolve));
    return jsdom.window.document;
}