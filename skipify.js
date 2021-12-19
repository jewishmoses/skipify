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

        return { status: 'failed' };

    }

    return response;

}

async function main() {

    document.getElementById('playMovie').disabled = true;

    let { cookie, token, status } = await getData();

    if (status == 'failed') {

        document.getElementById('playMovie').disabled = false;
        return;

    }

    window.jQuery('.action-buttons').hide();
    window.jQuery('.player-section').show();
    window.jQuery('.player-section .err').remove();

    document.cookie = cookie;

    window.getMovieStreamLink(window.movieID, token);

}

if (window.movieID !== undefined) {

    main();

}