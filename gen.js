import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch';
import fs from 'fs';
import colors from 'colors';

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'public/db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

if (fs.existsSync(file) == false) {

    db.data = [];
    await db.write();

}

await db.read();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveNewTokenAndCookieTODB() {

    const headers = { 'Cookie': 'Sratim=FAKE; path=/; domain=.sratim.tv; secure' };

    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
        headers,
    };

    const response = await fetch("https://api.sratim.tv/movie/preWatch", requestOptions)
    const token = await response.text();
    const cookie = response.headers.get('Set-Cookie');
    const created_at = Date.now();
    const isInvalid = cookie == null ? true : false;

    if (isInvalid == false) {

        db.data.push({ token, cookie, created_at, active: false, });
        await db.write();

    }

}

async function removeExpiredTokens() {

    let tokensCount = db.data.length - 1;
    let isEnouhTokens = tokensCount > 100 ? true : false;
    let data = db.data;

    for (let index in data) {

        console.log(index);
        let item = data[index];
        let { created_at } = item;

        const fiveMintues = 5 * 60000;
        const currentDateTS = new Date().getTime();
        const fiveMintuesAgo = new Date(created_at + fiveMintues).getTime();
        const isExpried = currentDateTS > fiveMintuesAgo;
        const isActive = currentDateTS > (created_at + 30001);

        if (isActive) {

            item.active = true;
            data.splice(index, 1, item);

        }

        if (isExpried) {

            data.splice(index, 1);
            index = index - 1;

        }

    }

    db.data = data;
    await db.write();
    await sleep(5000);

    if (isEnouhTokens == false) {

        await saveNewTokenAndCookieTODB();

    }

    removeExpiredTokens();

}

removeExpiredTokens();