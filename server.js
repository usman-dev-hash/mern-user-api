const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.port || 3001
const path = require('path')
const userRoutes = require('./routes/user')

mongoose.connect("mongodb://localhost:27017/crud", {
    useNewUrlParser: true, useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log("Mongoose connected successfully!")
})

// morgan for logging the HTTP request
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')))

// here we listening the server on defined port
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.use('/api/users/', userRoutes)
