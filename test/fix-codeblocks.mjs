import assert from "assert";
import RandExp from "randexp";
import { describe, it, beforeEach } from "mocha";
import { setup } from "./api.mjs";

const modId = "fix-codeblocks";
const modClass = "FixLemmyCodeblocksMod";

describe ("fix-codeblocks", function () {
    this.timeout(10000);
    this.slow(1000);

    beforeEach (async function () {
        this.document = await setup(modId, modClass);
        this.mod = this.document.mod;
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
            assert.doesNotMatch(style, new RegExp(`^${this.mod.getStylePattern()}$`));
            style = 'margin-left:3px;color:#434343;';
            assert.doesNotMatch(style, new RegExp(`^${this.mod.getStylePattern()}$`));
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
            assert.ok(!this.mod.getStylePattern().startsWith('^'));
            assert.ok(!this.mod.getStylePattern().endsWith('$'));
        })
    })

    describe ("getCodeBlocks", function () {
        it.skip ("still retrieves the expected elements", async function () {
            const link = "https://kbin.social/m/programming@programming.dev/t/726929";
            const document = await setup(modId, modClass, link);
            /** @type {HTMLElement[]} */
            const codeblocks = document.mod.getCodeBlocks();
            assert.equal(codeblocks.length, 2);
        })
        it.skip ("still retrieves the expected elements when run multiple times", async function () {
            const link = "https://kbin.social/m/programming@programming.dev/t/726929";
            const document = await setup(modId, modClass, link);
            document.mod.setup();
            /** @type {HTMLElement[]} */
            const codeblocks = document.mod.getCodeBlocks();
            assert.equal(codeblocks.length, 4);
        })
        it ("retrieves only already fixed code blocks when asked to", function () {
            /** @type {HTMLElement} */
            const pre = this.document.createElement("pre");
            pre.appendChild(this.document.createElement("code"));
            const fixedCode = this.document.createElement("code");
            fixedCode.setAttribute(this.mod.getFixedCodeAttributeName(), "");
            pre.appendChild(fixedCode);
            pre.appendChild(this.document.createElement("code"));
            this.document.querySelector("body").appendChild(pre);
            const codeblocks = this.mod.getCodeBlocks(true);
            assert.equal(codeblocks.length, 1);
        })
    })

    describe ("isErroneousCode", function () {
        it ("correctly differentiates between correct and erroneous blocks", function () {
            const code = this.document.createElement("code");
            const linePrefix = '<span style="font-style:italic;color:#666666;">';
            code.textContent = "\n"
                + `${linePrefix}public class Test {\n`
                + `</span>${linePrefix}   int example1 = 0;\n`
                + `</span>${linePrefix}   int example2 = 1;\n`
                + `</span>${linePrefix}}\n`
                + "</span>";
            assert.ok(this.mod.isErroneousCode(code), "false negative");
            code.textContent = "public class Test {\n"
                + "   int example1 = 0;\n"
                + "   int example2 = 1;\n"
                + "}";
            assert.ok(!this.mod.isErroneousCode(code), "false positive");
        })
    })

    describe ("isFixed", function () {
        it ("correctly identifies an already fixed block", function () {
            const container = this.document.createElement("pre");
            const buggyCode = this.document.createElement("code");
            container.appendChild(buggyCode);
            assert.ok(!this.mod.isFixed(buggyCode), "false positive");
            const fixedCode = this.document.createElement("code");
            fixedCode.setAttribute(this.mod.getFixedCodeAttributeName(), "");
            buggyCode.after(fixedCode);
            assert.ok(this.mod.isFixed(buggyCode), "false negative");
        })
    })

    describe ("fix", function () {
        it ("correctly fixes the block", function () {
            const code = this.document.createElement("code");
            this.document.querySelector("body").appendChild(code);
            const linePrefix = '<span style="font-style:italic;color:#666666;">';
            code.textContent = "\n"
                + `${linePrefix}public class Test {\n`
                + `</span>${linePrefix}   int example1 = 0;\n`
                + `</span>${linePrefix}   int example2 = 1;\n`
                + `</span>${linePrefix}}\n`
                + "</span>";
            this.mod.fix(code);
            assert.equal(this.document.querySelectorAll("code").length, 2);
            assert.equal(code.style.display, "none");
            assert.equal(
                code.nextElementSibling.textContent, 
                "public class Test {\n"
                + "   int example1 = 0;\n"
                + "   int example2 = 1;\n"
                + "}"
            );
        }) 
    })

    describe ("setup", function () {
        // TODO: add integration tests for single and repeated use when kbin works again
    })

    describe ("teardown", function () {
        // TODO: add integration tests for single and repeated use when kbin works again
    })
})