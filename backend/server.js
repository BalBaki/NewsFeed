require('dotenv').config({ path: '../.env' });
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const NewsAPI = require('newsapi');
const { User, Api } = require('./db');

const app = express();
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many request from this ip. Please try again after a few minutes',
});

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
app.use(limiter);

const newsApi = new NewsAPI(process.env.NEWS_API_KEY);

app.listen(process.env.API_PORT, () => {
    console.log(`Server work at port ${process.env.API_PORT}`);
});

//Register
//payload => email, password, name, surname
app.post('/register', (request, response) => {
    const email = request.body.email.toLowerCase();

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                User.create({ ...request.body, email, settings: {} }).then((newUser) => {
                    const { id, name, surname, email, settings } = newUser;

                    const token = jwt.sign({ id, email, name, surname }, process.env.JWT_SECRET_KEY, {
                        expiresIn: '10h',
                    });

                    response.json({ register: true, user: { id, name, surname, email, token, settings } });
                });
            } else {
                throw new Error('Exists Email');
            }
        })
        .catch((error) => response.json({ register: false, error: error.message }));
});

//Login
//payload => email, password
app.post('/login', (request, response) => {
    const email = request.body.email.toLowerCase();

    User.findOne({ email, password: request.body.password })
        .then((user) => {
            if (user) {
                const { id, name, surname, email, settings } = user;

                const token = jwt.sign({ id, email, name, surname }, process.env.JWT_SECRET_KEY, {
                    expiresIn: '10h',
                });

                response.json({ login: true, user: { id, name, surname, email, token, settings } });
            } else {
                throw new Error('Wrong Email or Password');
            }
        })
        .catch((error) => response.json({ login: false, error: error.message }));
});

//verify user token
//query => token
app.get('/verify', (request, response) => {
    jwt.verify(request.query.token, process.env.JWT_SECRET_KEY, function (err, decoded) {
        if (!err) {
            User.findOne({ email: decoded.email })
                .then((user) => {
                    if (user) {
                        const { id, name, surname, email, settings } = user;

                        response.json({ valid: true, user: { id, name, surname, email, settings } });
                    } else {
                        throw new Error('Invalid Token');
                    }
                })
                .catch((error) => response.json({ valid: false, error: error.message }));
        } else {
            response.json({ valid: false, error: 'Invalid Token' });
        }
    });
});

//Save Settings
//payload => id, token, settings
app.post('/savesettings', (request, response) => {
    jwt.verify(request.body.token, process.env.JWT_SECRET_KEY, function (err, decoded) {
        if (!err && decoded.id === request.body.id) {
            User.findOneAndUpdate({ _id: request.body.id }, { $set: { settings: request.body.settings } })
                .then(() => {
                    response.json({ save: true });
                })
                .catch((error) => {
                    response.json({ save: false, error: error.message });
                });
        } else {
            response.json({ save: false });
        }
    });
});

//Get Valid Apis
app.get('/apis', (request, response) => {
    Api.find()
        .then((apis) => {
            response.json({ apis });
        })
        .catch((err) => response.json({ error: err.message }));
});

//Get filter data
//query => name
app.get('/filterData', (request, response) => {
    const { name } = request.query;

    const filterDataPromises = {
        sources: () =>
            newsApi.v2
                .sources()
                .then((data) => {
                    response.json({ fetch: true, sources: data.sources });
                })
                .catch((error) => response.json({ fetch: false, error: error.message })),
        sections: () =>
            axios
                .get('https://content.guardianapis.com/sections', {
                    params: {
                        'api-key': process.env.GUARDIANS_API_KEY,
                    },
                })
                .then((data) => response.json({ fetch: true, sections: data.data.response.results }))
                .catch((err) => response.json({ fetch: false, error: err.message })),
    };

    if (!name) {
        response.json({ fetch: false, error: 'Enter valid filter name' });
    } else {
        filterDataPromises[name]();
    }
});

//search news
//payload => apis, fromDate, searchTerm, section, sources, toDate
app.post('/search', async (request, response) => {
    const { apis } = request.body;

    const searchPromises = {
        newsapi: fetch(
            'https://newsapi.org/v2/everything?' +
                new URLSearchParams({
                    q: request.body.searchTerm,
                    from: request.body.fromDate,
                    to: request.body.toDate,
                    sources: request.body.sources.join(','),
                    pageSize: 100,
                    apiKey: process.env.NEWS_API_KEY,
                })
        ).then((value) => value.json()),
        theguardians: fetch(
            'https://content.guardianapis.com/search?' +
                new URLSearchParams({
                    'api-key': process.env.GUARDIANS_API_KEY,
                    q: request.body.searchTerm,
                    ...(request.body.fromDate && { 'from-date': request.body.fromDate }),
                    'to-date': request.body.toDate,
                    ...(request.body.section && { section: request.body.section }),
                    'page-size': 100,
                    'show-fields': 'thumbnail,bodyText',
                    'show-tags': 'all',
                    'order-by': 'newest',
                })
        ).then((value) => value.json()),
    };

    const currentApiPromises = apis.map((apiName) => searchPromises[apiName]);

    try {
        const values = await Promise.all(currentApiPromises);
        let articles = [];
        const errors = [];

        values.forEach((result) => {
            if (result?.articles?.length > 0) {
                articles = articles.concat(result.articles);
            }

            if (result?.response?.results?.length > 0) {
                articles = articles.concat(result.response.results);
            }

            if (result?.status === 'error' || result?.response?.status === 'error' || result?.message) {
                errors.push(result?.message || result?.response?.message);
            }
        });

        if (errors.length > 0) throw new Error('Error at Fetching Articles');

        response.json({ search: true, articles });
    } catch (error) {
        response.json({ search: false, error: error.message });
    }
});
