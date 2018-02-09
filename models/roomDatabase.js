var monk = require('monk');
var db = monk('localhost:27017/roomDatabase');
var roomDatabase = db.get('roomDatabase');

//All functions return promises, don't know if this is the best way to do this.
//use .then(function(data){}) to get whatever data is needed
/**
 * Ex.
 * getFree(0, 1).then(function(free) {
 *      (use free array)
 * });
 */

/**
 *
 * @param day
 * @param roomID
 * @returns {promise}
 */
function getFree(day, roomID) { //gets the free array of the roomID on the day given
    var out = [];

    var find = new Promise(function (resolve, reject) {
        roomDatabase.find({RoomID: roomID}).each(function (data, i) {
            out = data.Free[day];

            resolve(out);
        });
    });

    return find;
}

/**
 *
 * @param roomID
 * @returns {promise}
 */
function getInfo(roomID) { //gets the info of the selected room (roomID)
    var out = {
        room: "Error",
        size: "Error",
        tv: "Error",
        phone: "Error",
        special: "Error",
        tempImgURL: "",
        roomid: roomID,
    };

    var find = new Promise(function(resolve, reject) {
        roomDatabase.find({RoomID: roomID}).each(function(data, i) {
            out.room = data.Name;
            out.size = data.Description;
            out.tempImgURL =  "/" + data.Picture;
            out.tv = data.tv;
            out.phone = data.phone;
            out.special = data.special;
            out.roomid = roomID;

            resolve(out);
        });
    });

    return find;
}

function getInfoByName(roomName) { //gets the info of the selected room (roomID)
    var out = {
        room: "Error",
        size: "Error",
        tv: "Error",
        phone: "Error",
        special: "Error",
        tempImgURL: "",
        roomid: "Error",
    };

    var find = new Promise(function(resolve, reject) {
        roomDatabase.find({Name: roomName}).each(function(data, i) {
            out.room = data.Name;
            out.size = data.Description;
            out.tempImgURL =  "/" + data.Picture;
            out.tv = data.tv;
            out.phone = data.phone;
            out.special = data.special;
            out.roomid = data.RoomID;

            resolve(out);
        });
    });

    return find;
}

/** Returns a list of each room, and if the room is currently free or not.  It also returns if the current user is the
 *  person who booked the room if the user is logged in
 *
 * @param day
 * @param time
 * @returns {*}
 */
function getListOfRoomState(day, time, usrid) {
    return new Promise(function(resolve, reject) {
        var listFree = [];
        usrid = typeof usrid  !== 'undefined' ? usrid : -1;

        return roomDatabase.find({}).each(function(data, i) {
            var roomNum = data.Name.match(/\d+/)[0]; // get the number from the room
            var mapRoomName = "BMH" + roomNum;
            var listRoomName = "bmh-" + roomNum;

            if (!isValidTime(time)) {
                listFree.push({
                    room: data.Name,
                    roomNum: mapRoomName,
                    roomID: listRoomName,
                    isFree: false,
                    size: data.size
                })
            } else {
                listFree.push({
                    room: data.Name,
                    roomNum: mapRoomName,
                    roomID: listRoomName,
                    size: data.size,
                    isFree: data.Free[day][time - 7].free,
                    isMine: (data.Free[day][time - 7].owner == usrid)  // true if the user booked the room, false otherwise
                })
            }

        }).then(function () {
            return resolve(listFree);

        });
    });
}

/**
 * Gets a list of room bookings for a specific user
 * @param day
 * @param time
 * @param usrid
 * @returns {*}
 */
function getListOfRoomsForUser(usrid) {
    return new Promise(function(resolve, reject) {
        var listBookings = [];
        usrid = typeof usrid  !== 'undefined' ? usrid : -1;

        //return roomDatabase.find({"Free": { $elemMatch: {owner: usrid}}}).each(function(data, i) {
        return roomDatabase.find().each(function(data, i) {
            for (var i = 0; i < data.Free[0].length; i++) {
                if (data.Free[0][i].owner === usrid) {
                    var roomNum = data.Name.match(/\d+/)[0]; // get the number from the room
                    var mapRoomName = "bmh" + roomNum;

                    listBookings.push({
                        room: data.Name,
                        roomNum: mapRoomName,
                        free: data.Free[0],
                        pic: data.Picture,
                        roomid: data.RoomID,
                        description: data.Description
                    });
                    break;
                }
            }

        }).then(function () {
            return resolve(listBookings);

        });
    });
}

function isValidTime(time){
    var dateObj = new Date();
    var current_min = dateObj.getMinutes();

    if (time < 7 || time > 23 || (time == 23 && current_min > 30) || (time == 7 && current_min < 30) )
         return false;
     return true;
}

module.exports = {
    getFree: getFree,
    getInfo: getInfo,
    getListOfRoomState: getListOfRoomState,
    getInfoByName: getInfoByName,
    getListOfRoomsForUser: getListOfRoomsForUser
};