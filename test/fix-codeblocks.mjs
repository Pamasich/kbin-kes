/* globals describe, it, beforeEach */ 

import assert from "assert";
import RandExp from "randexp";
import { setup } from "./api.mjs";

/** @type {Document} */
let document = undefined;

const modId = "fix-codeblocks";
const modClass = "FixLemmyCodeblocksMod";

describe ("fix-codeblocks", function () {
    this.timeout(10000);
    this.slow(1000);

    beforeEach (async function () {
        document = await setup(modId, modClass);
        this.mod = document.mod;
    })

    describe ("getStylePattern", function () {
        beforeEach (function () {
            this.styleRegex = new RegExp(this.mod.getStylePattern());
            this.randomColor = new RandExp(/[0-9a-fA-F]{6}/);
        })

        it ("should match any hexadecimal color", function () {
            assert.match(`color:#${this.randomColor.gen()};`, this.styleRegex);
            assert.match(`color:#${this.randomColor.gen()};`, this.styleRegex);
            assert.match(`color:#${this.randomColor.gen()};`, this.styleRegex);
        })
        it ("should match a color preceeded by a bold style", function () {
            const css = `font-weight:bold;color:#${this.randomColor.gen()};`;
            assert.match(css, this.styleRegex);
        })
        it ("should match a color preceeded by an italic style", function () {
            const css = `font-style:italic;color:#${this.randomColor.gen()};`
            assert.match(css, this.styleRegex);
        })
        it ("should not match if other properties are present", function () {
            let style = 'color:#222222;background-color:#333333;';
            assert.doesNotMatch(style, new RegExp(`^${document.mod.getStylePattern()}$`));
            style = 'margin-left:3px;color:#434343;';
            assert.doesNotMatch(style, new RegExp(`^${document.mod.getStylePattern()}$`));
        })
        it ("should not match if the color is not given in hexadecimal", function () {
            assert.doesNotMatch('color:rgb(255,255,255);', this.styleRegex);
            assert.doesNotMatch('color:hsl(0,100%,50%);', this.styleRegex);
            assert.doesNotMatch('color:red;', this.styleRegex);
        })
        it ("should not match if spaces are used", function () {
            assert.doesNotMatch('color: #222222;', this.styleRegex);
        })
        it ("should not check for the start or end of a string", function () {
            assert.ok(!document.mod.getStylePattern().startsWith('^'));
            assert.ok(!document.mod.getStylePattern().endsWith('$'));
        })
    })
})