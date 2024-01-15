/*
 * Lemmy federates its code blocks with syntax highlighting, but /kbin doesn't currently 
 * correctly handle that. It just displays the additional <span> tags for the syntax
 * highlighting in plain text. This makes the code very hard to read.
 * 
 * This mod fixes the issue by removing those erroneous tags.
 * 
 * Testing:
 * 
 * Todo:
 * - Explain the basic procedure to test that this works correctly
 * - Set up (possibly automated) unit tests
 * - Check if anything not yet covered needs to be. Does only Rust currently
 * have syntax highlighting federated? The federated highlighting and the
 * highlighting I can see on lemm.ee are very similar but not the same,
 * indicating that they're different implementations yet use similar rules.
 * Check if there's some common standardized style they use which could serve
 * as a reference.
 * 
 * Future Plans:
 * - Try to make sure this doesn't replace anything within strings.
 * - Maybe make a version that makes the federated syntax highlighting functional rather 
 * than removing it.
 */

class LemmyCodeFixer {
    static get _stylePattern () { 
        return "((font-style:italic|font-weight:bold);)?color:#[0-9a-fA-F]{6};"; 
    }
    static get testPattern () {
        return new RegExp(`^\\n?<span style="${this._stylePattern}">(.+\\n)+<\\/span>\\n?$`);
    }
    static get startPattern () {
        return new RegExp(`^\\n?<span style="${this._stylePattern}">`);
    }
    static get endPattern () {
        return new RegExp(`\\n<\\/span>\\n?$`);
    }
    static get combinedPattern () {
        return new RegExp(`<\\/span><span style="${this._stylePattern}">`, "g");
    }

    static get fixedCodeAttribute () { 
        return "data-fixed-code"; 
    }

    /** @param {HTMLElement} codeblock */
    repairCodeblock (codeblock) {
        if (!this.testPattern.test(codeblock.textContent)) return;
        if (codeblock.nextElementSibling?.hasAttribute(this.fixedCodeAttribute)) return;

        const fixedBlock = document.createElement("code");
        fixedBlock.setAttribute(this.fixedCodeAttribute, "");
        codeblock.after(fixedBlock);

        fixedBlock.textContent = codeblock.textContent
            .replace(this.startTagPattern, "")
            .replaceAll(this.combinedPattern, "")
            .replace(this.endTagPattern, "");

        codeblock.style.display = "none";
    }

    /** @param {HTMLElement} fixedBlock */
    revertCodeblock (fixedBlock) {
        /** @type {HTMLElement} */
        const originalBlock = fixedBlock.previousElementSibling;
        originalBlock.style.removeProperty("display");
        fixedBlock.parentNode.removeChild(fixedBlock);
    }

    repairAllCodeblocks () {
        document.querySelectorAll("pre code").forEach(this.repairCodeblock);
    }

    revertAllCodeblocks () {
        document.querySelectorAll(`pre code[${this.fixedCodeAttribute}]`)
            .forEach(this.revertCodeblock);
    }
}

function fixLemmyCodeblocks (isActive) { // eslint-disable-line no-unused-vars
    if (isActive) {
        LemmyCodeFixer.repairAllCodeblocks();
    } else {
        LemmyCodeFixer.revertAllCodeblocks();
    }
}
