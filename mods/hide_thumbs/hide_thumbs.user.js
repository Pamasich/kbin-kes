function hideThumbs (toggle) { //eslint-disable-line no-unused-vars
    const settings = getModSettings('hidethumbs')
    const inline = 'kes-inline-thumbs'
    const inlineCSS = `
    .thumbs {
        display:none
    }
    `
    function apply (sheet, name) {
        unset(name)
        safeGM("addStyle", sheet, name)
    }
    function unset (name) {
        safeGM("removeStyle", name)
    }
    if (toggle) {
        if (settings["inline"]) {
            apply(inlineCSS, inline)
        } else {
            unset(inline)
        }
    } else {
        unset(inline)
    }
}
