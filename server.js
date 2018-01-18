const Express = require('express');

const App = new Express();
        
//const Port = process.env.PORT || 8080; 
const Port = 8081;

require('./server/serverConfig.js')(App);

App.use(Express.static(__dirname + '/frontend/build'));

App.listen(Port, function() {
    console.log('Listening on port [%d]', Port);
});


module.exports = App;