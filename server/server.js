require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const rateLimit = require("express-rate-limit");
const cors = require('cors');

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

app.use(express.json());

let whitelist = [
    'http://localhost:5000',
    'http://www.customconnections.io',
    'https://www.customconnections.io',
    'http://customconnections.io',
    'https://customconnections.io'
];
let corsOptions = {
    origin: function (origin, callback) {
        if (process.env.LOGGING === "ON") { ("Origin (corsOptions): ", origin); }
        if ((process.env.NODE_ENV === 'development' && !origin) || !origin) {
            return callback(null, true);
        }
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

if (process.env.LOGGING === "ON") {
    app.use((req, res, next) => {
        console.log("Origin: ", req.headers.origin);
        console.log("Headers: ", req.headers);
        next();
    });
}

app.use('/api/*', cors(corsOptions));

app.use(express.static(path.join(__dirname, 'build')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Set environmental variables to match your database credientials
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const createGameLimiter = rateLimit({
    windowMs: 1.5 * 60 * 1000,
    max: 1,
    keyGenerator: function (req, res) {
        return req.ip;
    },
    message: { error: "Too many games created too quickly, please try again later." }
});


const connectDbAndStartServer = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

app.post('/api/game', createGameLimiter, async (req, res) => {
    try {
        const game = client.db("games").collection("games");
        await game.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 });

        const gameData = {
            ...req.body,
            createdAt: new Date(),
        };

        const result = await game.insertOne(gameData);

        res.json({
            id: result.insertedId,
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating game' });
    }
});

app.get('/api/game/:id', async (req, res) => {
    const { id: gameId } = req.params;

    if (!ObjectId.isValid(gameId)) {
        return res.status(400).json({ error: 'Invalid game id' });
    }

    try {
        const game = await client.db("games").collection("games").findOne({ _id: new ObjectId(gameId) });

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(game);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the game' });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

connectDbAndStartServer();