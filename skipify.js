async function playMovie() {

    let skipify_data = window.localStorage.getItem('skipify_data');
    skipify_data = JSON.parse(skipify_data);

    if (skipify_data.length == 0) {
        return;
    }

    window.wrappedJSObject.jQuery('body').off('click', '#playMovie');

    let { cookie, token } = skipify_data.shift();

    window.localStorage.setItem('skipify_data', JSON.stringify(skipify_data));

    window.wrappedJSObject.jQuery('.action-buttons').hide();
    window.wrappedJSObject.jQuery('.player-section').show();
    window.wrappedJSObject.jQuery('.player-section .err').remove();

    document.cookie = `Sratim=${cookie}; path=/; domain=.sratim.tv; secure`;

    window.wrappedJSObject.getMovieStreamLink(movieId, token);

}

player_skipify_data = window.localStorage.getItem('skipify_data');

if (player_skipify_data == null) {
    window.localStorage.setItem('skipify_data', JSON.stringify([]));
}

if (movieId !== undefined) {

    playMovie();

}