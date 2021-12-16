async function getData() {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let response;

    try {

        response = await fetch("https://sratim-tv.herokuapp.com/", requestOptions)
        response = await response.json();

    }
    catch (error) {

        return { status: false };

    }

    if (response.stauts == 'failed') {

        return { status: false };

    }

    return response;

}

async function main() {

    document.getElementById('playMovie').disabled = true;

    let { cookie, token, status } = await getData();

    if (status == false) {

        document.getElementById('playMovie').disabled = false;
        return;

    }

    window.wrappedJSObject.jQuery('.action-buttons').hide();
    window.wrappedJSObject.jQuery('.player-section').show();
    window.wrappedJSObject.jQuery('.player-section .err').remove();

    document.cookie = cookie;

    window.wrappedJSObject.getMovieStreamLink(movieId, token);

}

const movieId = window.wrappedJSObject.movieID;

if (movieId !== undefined) {

    main();

}