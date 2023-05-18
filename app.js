const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/user-route')

const app = express()
app.use(express.json())


app.use('/api', router)




mongoose.connect('mongodb://0.0.0.0:27017/mongosqlserver')
        .then(() => {
            app.listen(5000)
            console.log('Server is running')
        })
        .catch((err) => {
            console.log(err)
        })

