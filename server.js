const mongoose = require('mongoose');
const dotenv = require('dotenv')

process.on('unCaughtException', err => {
    console.log('Uncaught Exception! Shutting down...')
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: './config.env'})
const app = require('./app')

const DB = process.env.DATABASE_PROD

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'))

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});

// Error handling

process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting down...')
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});

