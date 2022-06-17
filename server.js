const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})
const app = require('./app')

const DB = process.env.DATABASE

mongoose.connect(DB, {
    useFindAndModify: true
}).then(() => console.log('DB connection successful!'))

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection! Shutting down...')
    server.close(() => {
        process.exit(1);
    })
});