require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const UserSchema = require('./models/user');
const ApiSchema = require('./models/api');

mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
        dbName: 'NewsFeed',
    })
    .then(() => {
        console.log('Connected DB');
    })
    .catch((err) => console.error(err));

const User = mongoose.model('User', UserSchema);
const Api = mongoose.model('Api', ApiSchema);

// If you dont have apis in db, run this code:
// Api.insertMany([
//     { name: 'newsapi', url: 'https://newsapi.org/v2/' },
//     { name: 'theguardians', url: 'http://content.guardianapis.com/' },
// ])
//     .then(() => console.log('Apis added to db.'))
//     .catch((error) => console.log('Error at inserting apis'));

module.exports = { User, Api };
