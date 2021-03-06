const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router')
const app = express();


//DB setup
mongoose.connect('mongodb://localhost:27017/auth',{ useNewUrlParser: true });
//App Setup
app.use(morgan('combined'));
app.use(bodyParser.json());
router(app);
//Server Setup
const PORT = process.env.PORT || 3090;
app.listen(PORT, () => {
    console.log('Server listening on:', PORT);
})
