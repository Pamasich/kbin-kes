function hideReputation (toggle) { //eslint-disable-line no-unused-vars
    const itemSelector = 'li:has(a[href$="/reputation/threads"])'
    if (toggle) {
        $(`#sidebar > section.section.user-info > ul > ${itemSelector}`).hide()
        document.styleSheets[0].addRule(`.user-popover ul ${itemSelector}`,'display:none')
    } else {
        $(`#sidebar > section.section.user-info > ul > ${itemSelector}`).show()
        document.styleSheets[0].addRule(`.user-popover ul ${itemSelector}`,'display:initial')
    }
}
