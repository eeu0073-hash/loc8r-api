const mongoose = require('mongoose');
require('dotenv').config();

let gracefulShutdown;

// MongoDB Atlas 연결 설정
const dbPassword = process.env.MONGODB_PASSWORD;
const dbURI = `mongodb+srv://eeu0073:${encodeURIComponent(dbPassword)}@cluster0.uwkic7v.mongodb.net/Loc8r`;

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close().then(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    }).catch(function (err) {
        console.log('Mongoose shutdown error: ' + err);
        callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./locations');