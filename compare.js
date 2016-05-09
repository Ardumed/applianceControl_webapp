var mongojs = require('mongojs');
var five = require("johnny-five");
var board = new five.Board({
    baudrate: 9600
});
var asyncjs = require('async');

board.on("ready", function() {

    new five.Pin({
        pin: 'A0',
        type: "digital"
    });

    new five.Pin({
        pin: 'A1',
        type: "digital"
    });

    new five.Pin({
        pin: 'A2',
        type: "digital"
    });

    var led1 = new five.Led('A0');
    var led2 = new five.Led('A1');
    var led3 = new five.Led('A2');
    led1.off();
    led2.off();
    led3.off();
    var i = 0;
    asyncjs.forever(
        function(next) {
            i += 1;
            continuousDataNotifier(i);
            if (i > 2000) {
                i = 0;
            }
            console.log(i);
            next();
        },
        function(err) {
            // if next is called with a value in its first parameter, it will appear
            // in here as 'err', and execution will stop.
        });
    // while(true){
    //   continuousDataNotifier();
    //   sleep(2000);
    // }
});

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while (new Date().getTime() < unixtime_ms + ms) {}
}

var continuousDataNotifier = function(i) {
    if (i != 1) {
        return 0;
    }
    url = 'mongodb://admin:nON6zS3uWa99wtGS@SG-ardumed-7417.servers.mongodirector.com:27017/iot';
    db = mongojs(url, ['user', 'simulation']);

    var dbPromise1 = new Promise(function(resolve, reject) {
        db.simulation.find().sort({
            $natural: -1
        }).limit(1, (function(err, docs) {
            if (err) {
                return reject(err);
            }
            resolve(docs);
        }));
    });

    var dbPromise2 = new Promise(function(resolve, reject) {
        db.user.find().sort({
            $natural: -1
        }).limit(1, (function(err, docs) {
            if (err) {
                return reject(err);
            }
            resolve(docs);
        }));
    });


    return Promise.all([dbPromise1, dbPromise2])
        .then(function(result1) {
            db.close();
            console.log(result1);
            // console.log(result2);
            var applianceObj = result1[0][0];

            var led1 = new five.Led('A0');
            var led2 = new five.Led('A1');
            var led3 = new five.Led('A2');
            led1.off();
            led2.off();
            led3.off();

        }).then(function(result) {
            console.log(result);
        });
};


/**
 *
 *THIS IS THE BOARD CONTROLLER -  WHEN THIS RUNS, THE BOARD IS SWITHCED ON
 *AFTER THAT IT RUNS THE ABOVE FUNCTIONS TO GET LATEST RECORDS OF THE BOTH
 *USER AND SIMULATION
 *
 * DEPENDING UPON SIMULATION CHANGES, THE LED BLINKS WILL CHANGE
 *
 */

// continuousDataNotifier(dbPromise1, dbPromise2, db).then(setTimeout(console.log(), 2000));

// async continuousDataNotifier()
