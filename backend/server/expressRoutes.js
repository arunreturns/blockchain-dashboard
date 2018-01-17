const sqlite3 = require('sqlite3').verbose();
const Path = require('path');

module.exports = function(App) {
    App.get("/list", function(req, res){
        res.sendFile(Path.join(__dirname, 'mock.json'))
        // const db = new sqlite3.Database('./server/ticker.db');
        // db.serialize(function() {
        //     db.all(`SELECT Main.*, DATETIME(last_updated, 'unixepoch') AS last_upd FROM ticker_info Main
        //             INNER JOIN
        //             (SELECT name, MAX(last_updated) AS max_last_updated
        //             FROM ticker_info
        //             GROUP BY name) Grouped 
        //             ON Main.name = Grouped.name 
        //             AND Main.last_updated = Grouped.max_last_updated`, 
        //     function(err, rows) {
        //         if (err){
        //             console.log(err);
        //             res.send(err);
        //         }
        //         res.send(rows);
        //     });
        // });
        // db.close();
    });
    
    App.get('/info/:currencyName', function(req, res){
        const db = new sqlite3.Database('./server/ticker.db');
        console.log(req.params);
        db.all("SELECT *, DATETIME(last_updated, 'unixepoch') AS last_upd FROM ticker_info WHERE name = ?", req.params.currencyName, function(err, rows) {
            if (err){
                console.log(err);
                res.send(err);
            }
            res.send(rows);
        });
        
        db.close();
    });
};