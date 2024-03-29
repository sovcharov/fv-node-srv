/*jslint nomen: true, node: true, unparam: true*/
(function () {
    "use strict";
    var createRevenueData = require('./services/createrevenuedata.js'),
      fs = require('fs'),
      myFunctions = require('./services/myfunctions'),
      firstSpin = true,
      revenueStore = function () {
        var date = new Date();
        var hour = date.getUTCHours()+3,
            minute = date.getUTCMinutes();
        if(firstSpin || (hour <= 23 && hour >= 8 && minute % 15 === 5)) {
          console.log("Start: ", date);
          createRevenueData.getDataFromDB(function (data) {
            // console.log(data);
            date = new Date();
            var currentDate = myFunctions.getDateString(date) + " " + myFunctions.getTimeString(date);
            data[data.length] = currentDate;
            fs.writeFile(__dirname + "/../bakerydata.json", JSON.stringify(data), function (err) {
              if(err) {
                console.log("Error writing file: ", err);
              }
              date = new Date();
              console.log("Finish: ", date);
            })
          });
          createRevenueData.getStores(function (data) {
            fs.writeFile(__dirname + "/../stores.json", JSON.stringify(data), function (err) {
              if(err) {
                console.log(err);
              }
            })
          });
        }
        firstSpin = false;
      };
    revenueStore();//THIS JUST FOR THE FIRST SPIN
    setInterval(revenueStore, 60000);
}());
