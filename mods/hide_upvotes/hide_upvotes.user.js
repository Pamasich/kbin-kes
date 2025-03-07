function hideUpvotes (toggle) { //eslint-disable-line no-unused-vars
    if (toggle) {
        $('form.vote__up').hide();
    } else {
        $('form.vote__up').show();
    }
}
