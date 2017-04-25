const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
const morgan         = require('morgan');
const port = 8000;
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// MongoClient.connect(db.url, (err, database) => {
//     if (err) return console.log(err);
//     require('./app/routes')(app, database);
//
//     app.listen(port, () => {
//         console.log('We are live on ' + port);
//     });
// })

mongoose.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    require('./app/routes')(app, database);

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
})
