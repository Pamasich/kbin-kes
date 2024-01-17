/* globals describe, it, beforeEach */ 

import assert from "assert";
import RandExp from "randexp";
import { setup } from "./api.mjs";

/** @type {Document} */
let document = undefined;

describe ("fix-codeblocks", function () {
    beforeEach (async function () {
        document = await setup("fix-codeblocks", "LemmyCodeFixer");
    });

    describe ("stylePattern", function () {
        it ("should exist", function () {
            assert.ok(document.mod.stylePattern != undefined);
            assert.ok(document.mod.stylePattern != null);
            assert.ok(document.mod.stylePattern != "");
        });
        it ("should match any hexadecimal color with no additional properties", function () {
            const randomColor = new RandExp(/[0-9a-fA-F]{6}/);
            assert.match(`color:#${randomColor.gen()};`, new RegExp(document.mod.stylePattern));
            assert.match(`color:#${randomColor.gen()};`, new RegExp(document.mod.stylePattern));
            assert.match(`color:#${randomColor.gen()};`, new RegExp(document.mod.stylePattern));
        })
        it ("should match a color preceeded by a bold style", function () {
            const randomColor = new RandExp(/[0-9a-fA-F]{6}/).gen();
            const css = `font-weight:bold;color:#${randomColor};`;
            assert.match(css, new RegExp(document.mod.stylePattern));
        })
        it ("should match a color preceeded by an italic style", function () {
            const randomColor = new RandExp(/[0-9a-fA-F]{6}/).gen();
            const css = `font-style:italic;color:#${randomColor};`
            assert.match(css, new RegExp(document.mod.stylePattern));
        })
        it ("should not match if other properties are present", function () {
            let style = 'color:#222222;background-color:#333333;';
            assert.doesNotMatch(style, new RegExp(`^${document.mod.stylePattern}$`));
            style = 'margin-left:3px;color:#434343;';
            assert.doesNotMatch(style, new RegExp(`^${document.mod.stylePattern}$`));
        })
        it ("should not match if the color is not given in hexadecimal", function () {
            assert.doesNotMatch('color:rgb(255,255,255);', new RegExp(document.mod.stylePattern));
            assert.doesNotMatch('color:hsl(0,100%,50%);', new RegExp(document.mod.stylePattern));
            assert.doesNotMatch('color:red;', new RegExp(document.mod.stylePattern));
        })
        it ("should not match if spaces are used", function () {
            assert.doesNotMatch('color: #222222;', new RegExp(document.mod.stylePattern));
        })
        it ("should not check for the start or end of a string", function () {
            /** @type {String} */
            const pattern = document.mod.stylePattern;
            assert.ok(!pattern.startsWith('^'));
            assert.ok(!pattern.endsWith('$'));
        })
    })
})