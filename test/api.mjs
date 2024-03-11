import { JSDOM } from "jsdom";
import process from "node:process";

/**
 * @param {String} mod 
 * @param {String} main_function 
 * @param {String?} loadFromUrl
 * @deprecated
*/
export async function setup (mod, main_function, loadFromUrl = null) {
    return loadFromUrl == null
        ? launchDOMWithMod("", mod, main_function)
        : loadPageWithMod(loadFromUrl, mod, main_function);
}

/**
 * @param {String} url
 */
export async function loadPage (url) {
    const html = await downloadPage(url);
    return await launchDOM(html);
}

/**
 * @param {String} url
 * @param {String} modid
 * @param {String} classname
 */
export async function loadPageWithMod (url, modid, classname) {
    const html = await downloadPage(url);
    return await launchDOMWithMod(html, modid, classname);
}

/**
 * @param {String} html
 */
export async function launchDOM (html) {
    const jsdom = new JSDOM( html, { runScripts: "dangerously", resources: "usable" } );
    await new Promise((resolve) => jsdom.window.addEventListener("load", resolve));
    return jsdom.window.document;
}

/**
 * @param {String} html
 * @param {String} modid
 * @param {String} classname
 */
export async function launchDOMWithMod (html, modid, classname) {
    html += `<script src="file:${process.cwd()}/mods/${modid}/${modid}.user.js"></script>`;
    html += `<script>document.mod = new ${classname}();</script>`;
    return await launchDOM(html);
}

/**
 * @param {String} url
 */
export async function downloadPage (url) {
    const response = await fetch(url);
    return await response.text();
}