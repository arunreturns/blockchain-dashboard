const sqlite3 = require('sqlite3').verbose();
const Path = require('path');
const DBName = process.env.DB_NAME || 'ticker.db';
const DBPath = Path.join(__dirname, 'database', DBName);
const fs = require('fs');

module.exports = function(App) {
    App.get("/list", function(req, res){
        let MockFile = Path.join(__dirname, 'mock', `list.json`);
        if ( fs.existsSync(MockFile)){
            console.log("Mocking..");
            res.sendFile(MockFile);
        } else {
            const db = new sqlite3.Database(DBPath);
            db.serialize(function() {
                db.all(`SELECT Main.*, DATETIME(last_updated, 'unixepoch') AS last_upd FROM ticker_info Main
                        INNER JOIN
                        (SELECT name, MAX(last_updated) AS max_last_updated
                        FROM ticker_info
                        GROUP BY name) Grouped 
                        ON Main.name = Grouped.name 
                        AND Main.last_updated = Grouped.max_last_updated`, 
                function(err, rows) {
                    if (err){
                        console.log(err);
                        res.status(500).send(err);
                    }
                    fs.writeFileSync(MockFile, JSON.stringify(rows));
                    res.status(200).send(rows);
                });
            });
            db.close();
        }
    });
    
    App.get('/info/:currencyName', function(req, res){
        let MockFile = Path.join(__dirname, 'mock', `${req.params.currencyName}.json`);
        if ( fs.existsSync(MockFile)){
            console.log("Mocking..");
            res.sendFile(MockFile);
        } else {
            const db = new sqlite3.Database(DBPath);
            console.log(req.params);
            db.all("SELECT *, DATETIME(last_updated, 'unixepoch') AS last_upd FROM ticker_info WHERE name = ? ORDER BY last_updated", req.params.currencyName, function(err, rows) {
                if (err){
                    console.log(err);
                    res.status(500).send(err);
                }
                fs.writeFileSync(MockFile, JSON.stringify(rows));
                res.status(200).send(rows);
            });
            
            db.close();
        }
    });
};	