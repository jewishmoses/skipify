function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function getTokenWithCookie() {

    document.cookie = 'Sratim=FAKE; path=/; domain=.sratim.tv; secure';

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
    };

    let response = await fetch("https://api.sratim.tv/movie/preWatch", requestOptions)
    let token = await response.text();
    let cookie = getCookie('Sratim');

    console.log({ token, cookie })

    return { token, cookie };
}


async function generate() {

    await sleep(2000);

    let skipify_data = window.localStorage.getItem('skipify_data');
    skipify_data = JSON.parse(skipify_data);

    let skipify_last_generated_at = window.localStorage.getItem('skipify_last_generated_at');

    let oneHour = 1000 * 60 * 30;

    if (((new Date) - skipify_last_generated_at) > oneHour) {

        skipify_data = [];

    }

    if (skipify_data.length > 20) {

        generate();
        return;

    }

    const data = await getTokenWithCookie();

    skipify_data.push(data);

    window.localStorage.setItem('skipify_data', JSON.stringify(skipify_data));

    window.localStorage.setItem('skipify_last_generated_at', Date.now());

    generate();

}

let skipify_last_generated_at = window.localStorage.getItem('skipify_last_generated_at');

if (skipify_last_generated_at == null) {
    window.localStorage.setItem('skipify_last_generated_at', Date.now());
}

let skipify_data = window.localStorage.getItem('skipify_data');

if (skipify_data == null) {
    window.localStorage.setItem('skipify_data', JSON.stringify([]));
}

let movieId = window.wrappedJSObject.movieID;

if (movieId == undefined) {

    generate();

}