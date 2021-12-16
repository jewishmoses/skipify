require('dotenv').config();
const axios = require('axios').default;
const express = require('express');
const cors = require("cors");
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelizeOptions = {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
};

const sequelize = new Sequelize(sequelizeOptions);

class Movie extends Model { }

const movieAttributes = {
    token: DataTypes.STRING,
    cookie: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
}

Movie.init(movieAttributes, { sequelize, modelName: 'movie' });

(async () => { await sequelize.sync(); })();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveNewTokenAndCookieTODB() {

    const headers = { 'Cookie': 'Sratim=FAKE; path=/; domain=.sratim.tv; secure' };

    const requestOptions = {
        method: 'get',
        url: "https://api.sratim.tv/movie/preWatch",
        withCredentials: true,
        headers,
    };

    let response;

    try
    {
        response = await axios(requestOptions);
    }
    catch (error)
    {
        console.log(error);
        await removeExpiredTokens();
        return;
    }

    const token = response.data;
    const cookie = response.headers['set-cookie'][0];
    const isInvalid = cookie == null ? true : false;

    if (isInvalid == false) {

        await Movie.create({ token, cookie, active: false, });

    }

    await removeExpiredTokens();

}

async function removeExpiredTokens() {

    const movies = await Movie.findAll();
    const moviesCount = movies.length;
    let isEnouhMovies = moviesCount > 100 ? true : false;

    for (let movie in movies) {

        const item = movies[movie];
        const { id, createdAt, active } = item;
        const created_at = new Date(createdAt).getTime();

        const fiveMintues = 5 * 60000;
        const currentDateTS = new Date().getTime();
        const fiveMintuesAgo = new Date(created_at + fiveMintues).getTime();
        const isExpried = currentDateTS > fiveMintuesAgo;
        let isActive = currentDateTS > (created_at + 30001);

        if (isExpried) {

            await Movie.destroy({ where: { id } });
            continue;
        }

        if (active) {
            continue;
        }

        if (isActive) {

            await Movie.update({ active: true }, { where: { id } });

        }

    }

    await sleep(5000);

    if (isEnouhMovies == false) {

        await saveNewTokenAndCookieTODB();

    }

    removeExpiredTokens();

}

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {

    const movie = await Movie.findOne({ where: { active: true } });
    const movieExists = movie != null;

    if (movieExists == false) {
        
        res.json({ status: 'failed' });
        return;

    }

    await movie.destroy();
    res.json(movie);

});

app.listen(process.env.PORT, '0.0.0.0');

saveNewTokenAndCookieTODB();