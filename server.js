const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
const morgan         = require('morgan');
var mongoose         = require('mongoose');
var cors             = require('cors');
var path             = require('path');
const port = 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// MongoClient.connect(db.url, (err, database) => {
//     if (err) return console.log(err);
//     require('./app/routes')(app, database);
//
//     app.listen(port, () => {
//         console.log('We are live on ' + port);
//     });
// })

var isProduction = process.env.NODE_ENV === 'production';

if(!isProduction){
    mongoose.set('debug', true);
}


// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({'errors': {
            message: err.message,
            error: err
        }});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
        message: err.message,
        error: {}
    }});
});


app.use(require('./app/routes'));
// app.use('/public', express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));


mongoose.connect(db.url, (err) => {
    if (err) return console.log(err);
    // require('./app/routes')(app);

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
});

