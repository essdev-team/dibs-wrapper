var express = require('express');
var router = express.Router();
var roomBook = require('../models/roomBooking');
var roomDB = require('../models/roomDatabase');
var accountFuncs = require('../models/userFunctions');


router.get('/quicky', function (req, res, next) { //the request to render the page
    if (!req.isAuthenticated())
        return res.redirect('/accounts');

    res.render('quick', {
        theme: req.theme === "custom" ? false : req.theme,
        colors: req.colors
    });
});

router.post('/quicky', function (req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/login?redirect=/quicky'); // do the redirecting thing TODO: Alex?

    var usrid = accountFuncs.getUserID(req);

    roomDB.getNextFree().then(function(out) {
        if (out === {})
            return res.send("No free rooms!");

        var time = roomDB.getNextValidHalfHour(false, true);
        roomBook.bookRoom(0, time, out, 1, usrid, req).then(function (data) {
            console.log(data.bookMsg);
            res.send({HeaderMsg: data.header, BookingStatusMsg: data.bookMsg, BookStatus: data.success});
        }).catch(function(err) {
            console.log(err);
            res.send("An error occurred while rushing to Automagically™ QuickBook™ your room.")
        });
    })
});

module.exports = router;