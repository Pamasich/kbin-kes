function moveFederationWarningEntry (toggle) { //eslint-disable-line no-unused-vars
    const loc = window.location.href.split('/')
    // only run on magazine, profile, and "all content" pages
    if ((loc[3] !== "m") && (loc[3] !== "u") && (loc[3] !== "*")) return;
    if ((loc[3] === "*") && (loc[4] !== "m")) return;

    let settings = getModSettings("moveFederationWarning");
    let alertBox = $(".alert.alert__info");
    let insertAfterQuery = "";

    if(toggle) {
        if ((loc[3] === "m") || (loc[3] === "*")) {
            insertAfterQuery = "#sidebar .magazine .magazine__subscribe";
        } else {
            insertAfterQuery = "#sidebar .section.user-info";
        }

        if(settings["action"] === "Hide completely") {
            alertBox.hide();
        } else {
            alertBox.show();
        }
    } else {
        const options = document.querySelectorAll('#main #options')
        insertAfterQuery = options[options.length-1]
        alertBox.show();
    }

    let insertAfter = $(insertAfterQuery);

    if(alertBox !== null && insertAfter !== null) {
        insertAfter.after(alertBox);
    }
}
