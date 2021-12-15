const express = require('express');
const cors = require("cors");
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelizeOptions = {
    dialect: 'sqlite',
    storage: './database.sqlite'
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

app.listen(8080, '0.0.0.0');