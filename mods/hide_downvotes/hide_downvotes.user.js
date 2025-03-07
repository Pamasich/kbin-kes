function hideDownvotes (toggle) { // eslint-disable-line no-unused-vars
    if (toggle) {
        $('form.vote__down').hide();
    } else {
        $('form.vote__down').show();
    }
}
