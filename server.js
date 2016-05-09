var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongojs = require('mongojs');
var assert = require('assert');
var url = 'mongodb://admin:nON6zS3uWa99wtGS@SG-ardumed-7417.servers.mongodirector.com:27017/admin';



app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts/'));
app.use('/images', express.static(__dirname + '/images/'));
app.use('/js', express.static(__dirname + '/js/'));
//app.use(express.static(__dirname + '/src/login'));

//app.get('/login', function (req, res) {
//  res.sendFile(path.join(__dirname + '/src/login/login.html'));
//});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/currentstatus', function(req, res) {
    url = 'mongodb://admin:nON6zS3uWa99wtGS@SG-ardumed-7417.servers.mongodirector.com:27017/admin';
    db = mongojs(url, ['control']);
    var dataObject = db.control.find().sort({
        $natural: -1
    }).limit(1, (function(err, docs) {
        console.log(docs);
        res.send(docs[0]);
    }));
});

app.post('/setstatus', function(req, res) {
    getDetails(req);
    // console.log(req);
    // res.sendFile(path.join(__dirname + '/simget.html'));
    // var x = true;
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/simulation', function(req, res) {
    res.sendFile(path.join(__dirname + '/simget.html'));
});

app.post('/simulation', function(req, res) {
    var reply = {};
    // reply.date = req.body.date;
    // reply.time = req.body.time;
    simulationSave(req);
    res.sendFile(path.join(__dirname + '/simget.html'));
});

var getDetails = function(req) {
    var det = {};
    var appliances = ['light', 'fan', 'tv', 'footlight', 'nightlamp', 'ac', 'airPurifier', 'waterPurifier', 'geyser', 'chimney', 'fridge', 'washingMachine']
    for (var i = 0; i < appliances.length; i++) {
        if (typeof(req.body[appliances[i]]) === "undefined") {
            det[appliances[i]] = false;
        } else {
            det[appliances[i]] = true;
        }
    }


    var insertDocument = function(db, callback) {
        db.collection('control').insertOne(det, function(err, result) {
            assert.equal(err, null);
            console.log(det);
            console.log("Inserted a document into the user collection.");
            callback();
        });
    };

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        });
    });
};


var simulationSave = function(req) {
    var det = {};
    var x = new Date(req.body.date + ' ' + req.body.time);
    det.datetime = x;

    var insertDocument = function(db, callback) {
        db.collection('simulation').insertOne(det, function(err, result) {
            assert.equal(err, null);
            console.log(det);
            console.log("Inserted a document into the control collection.");
            callback();
        });
    };

    return MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        });
    });

};

/**
 * - POST : set prescription
 * - GET: mainpage : introduction page
 * - GET: day : prescription for that day
 */


var port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log(__dirname);
    console.log('Example app listening on port ' + port + ' !');
});
