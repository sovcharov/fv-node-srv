/*jslint nomen: true, node: true, unparam: true*/
(function () {
    "use strict";
    var createRevenueData = require('./services/createrevenuedata4s.js'),
      fs = require('fs'),
      myFunctions = require('./services/myfunctions'),
      firstSpin = true,
      revenueStore = function () {
        var date = new Date();
        var hour = date.getUTCHours()+3,
            minute = date.getUTCMinutes();
        if((hour <= 23 && hour >= 8 && minute % 15 === 9) || firstSpin) {
          console.log("Start: ", date);
          createRevenueData.getDataFromDB(function (data) {
            date = new Date();
            var currentDate = myFunctions.getDateString(date) + " " + myFunctions.getTimeString(date);
            data[data.length] = currentDate;
            fs.writeFile(__dirname + "/../data4s.json", JSON.stringify(data), function (err) {
              if(err) {
                console.log(err);
              }
              date = new Date();
              console.log("Finish: ", date);
            })
          });
          createRevenueData.getStores(function (data) {
            fs.writeFile(__dirname + "/../stores4s.json", JSON.stringify(data), function (err) {
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
