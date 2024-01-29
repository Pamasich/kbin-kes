import { JSDOM } from "jsdom";
import process from "node:process";

/**
 * @param {String} mod 
 * @param {String} main_function 
 * @param {String?} loadFromUrl
*/
export async function setup (mod, main_function, loadFromUrl = null) {
    let html = "";
    if (loadFromUrl != null) {
        const response = await fetch(loadFromUrl);
        html = await response.text();
    }
    html += `<script src="file:${process.cwd()}/mods/${mod}/${mod}.user.js"></script>`;
    html += `<script>document.mod = new ${main_function}();</script>`;
    const jsdom = new JSDOM( html, { runScripts: "dangerously", resources: "usable" } );
    await new Promise((resolve) => jsdom.window.addEventListener("load", resolve));
    return jsdom.window.document;
}