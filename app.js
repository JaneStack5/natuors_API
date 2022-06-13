const fs = require('fs')
const express = require('express');
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')

const app = express()
//Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

//Handler for unhandeled routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
})

module.exports = app;