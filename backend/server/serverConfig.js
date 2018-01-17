const BodyParser = require('body-parser');
const MethodOverride = require('method-override');
const Morgan = require('morgan');
const Helmet = require('helmet');
const Compression = require('compression');
const Path = require('path');
const Favicon = require('serve-favicon');
const fs = require('fs');

module.exports = function (App) {
    if (fs.existsSync(Path.join(__dirname, 'favicon.ico'))) 
        App.use(Favicon(Path.join(__dirname, 'favicon.ico')));
    App.use(Morgan('dev'));
    App.use(BodyParser.json());
    App.use(BodyParser.json({type: 'application/vnd.api+json'}));
    App.use(BodyParser.urlencoded({extended: true}));
    App.use(MethodOverride('X-HTTP-Method-Override'));
    App.use(Helmet());
    App.use(Compression());

    /* Enable CORS */
    App.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    require('./expressRoutes.js')(App);
};