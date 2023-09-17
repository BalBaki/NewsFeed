const mongoose = require('mongoose');

module.exports = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);
