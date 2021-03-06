/*jslint nomen: true, node: true*/
(function () {
    "use strict";

    var normalequation = require('./normalequation'),

        fillDataToForecast = function (salesData, matrixToForecast, vectorToForecast) {
            var i,
                qtyOfParams = 3;

            for (i = 0; i < salesData.length; i += 1) {
                matrixToForecast[i * qtyOfParams] = 1;
                matrixToForecast[i * qtyOfParams + 1] = salesData[i].qty + salesData[i].loss;
                matrixToForecast[i * qtyOfParams + 2] = Math.pow(matrixToForecast[i * qtyOfParams + 1], 2);
                vectorToForecast[i] = salesData[i].income;
            }
            // console.log('order');
            // for (i = 0; i < salesData.length; i += 1) {
            //     console.log(matrixToForecast[i * qtyOfParams + 1]);
            // }
            // console.log('income');
            // for (i = 0; i < salesData.length; i += 1) {
            //     console.log(vectorToForecast[i]);
            // }
        },

        forecast = function (salesData) {
            var hours,
                minutes,
                i,
                averageSalePerHour,
                hoursToEnd,
                hoursFromStart,
                lossesFromSmallOrder,
                matrixToForecast = [],
                vectorToForecast = [],
                coefficients,
                averageSales = 0,
                averageDemand = 0,
                prediction;

            //let's count incomes, losses, average sales and average demand
            for (i = 0; i < salesData.length; i += 1) {
                salesData[i].income = salesData[i].qty - salesData[i].loss;
                salesData[i].totalDemand = salesData[i].qty;

                hours = parseInt(salesData[i].timeOfLastSale.getUTCHours(), 10);
                minutes = parseInt(salesData[i].timeOfLastSale.getUTCMinutes(), 10);
                if (salesData[i].loss === 0 && hours < 22) {
                    hoursToEnd = ((22 - hours) - (minutes / 60));
                    hoursFromStart = ((hours - 8) + (minutes / 60));
                    averageSalePerHour = (salesData[i].qty / hoursFromStart);
                    lossesFromSmallOrder = averageSalePerHour * hoursToEnd;
                    salesData[i].income = salesData[i].income - lossesFromSmallOrder;
                    salesData[i].totalDemand = salesData[i].qty + lossesFromSmallOrder;
                }
                averageSales += salesData[i].qty;
                averageDemand += salesData[i].totalDemand;
                // console.log(">"+salesData[i].income + " " + salesData[i].qty + " " + hoursToEnd + " " + hoursFromStart + " " + averageSalePerHour + " " + lossesFromSmallOrder);
            }
            averageSales = averageSales / salesData.length;
            averageDemand = averageDemand / salesData.length;

            //now let's just return average demand
            //
            return averageDemand;

            //
            // //////////////////////
            // //   FORECAST PART
            // //////////////////////
            //
            // //insert data to get proper function shape
            // //
            // salesData[salesData.length] = {
            //     qty: 0,
            //     loss: 0,
            //     income: 0
            // };
            // salesData[salesData.length] = {
            //     qty: averageSales * 2,
            //     loss: averageSales,
            //     income: 0
            // };
            //
            // //here we prepare data to send for normal equation
            // fillDataToForecast(salesData, matrixToForecast, vectorToForecast);
            // //let's get coeffs for the function describing behavior of sales
            // coefficients = normalequation(matrixToForecast, salesData.length, 3, vectorToForecast);
            //
            // //here is a maximum (optimum) for function
            // prediction = -coefficients[1] / (2 * coefficients[2]);
            //
            // //let's change model for it to work great
            // //we not using maximum as forecast, we are using behavior to see the trend and change average demand slightly
            // //to side where maximum of function is
            // //
            // var deviation = 0.07,
            //     highPercent = 1 + deviation,
            //     lowPercent = 1 - deviation;
            //
            // if (prediction/averageDemand > highPercent) {
            //     prediction = averageDemand * highPercent;
            // } else if (prediction/averageDemand < lowPercent) {
            //     prediction = averageDemand * lowPercent;
            // }
            //
            // return prediction;
        };

    module.exports = forecast;
}());
//     var normalequation = require('./normalequation');
//     var x = normalequation([1,30,900,
// 1,30,900,
// 1,29,841,
// 1,31.25,976.5625,
// 1,9.5,90.25,
// 1,30.25,915.0625,
// 1,30,900,
// 1,25,625,
// 1,25,625,
// 1,26.75,715.5625,
// 1,24.75,612.5625,
// 1,23,529,
// 1,26.5,702.25,
// 1,24.5,600.25,
// 1,24.75,612.5625,
// 1,25,625,
// 1,23.75,564.0625,
// 1,18,324,
// 1,25,625,
// 1,25,625,
// 1,23,529,
// 1,26,676,
// 1,25.25,637.5625,
// 1,25,625,
// 1,30.78,947.4084,
// 1,33,1089,
// 1,31,961,
// 1,30,900,
// 1,34.75,1207.5625,
// 1,38.5,1482.25,
// 1,27.25,742.5625,
// 1,39.5,1560.25,
// 1,31.5,992.25,
// 1,25.5,650.25,
// 1,18.75,351.5625,
// 1,15,225,
// 1,30,900,
// 1,25,625,
// 1,40,1600,
// 1,15.5,240.25,
// 1,24,576,
// 1,15,225,
// 1,15,225,
// 1,15,225,
// 1,20,400,
// 1,25,625,
// 1,24.5,600.25,
// 1,25,625,
// 1,18,324,
// 1,20,400,
// 1,15,225,
// 1,20,400,
// 1,29.5,870.25,
// 1,25,625,
// 1,25,625,
// 1,23.5,552.25,
// 1,18.5,342.25,
// 1,20,400,
// 1,20,400,
// 1,20,400,
// 1,20,400,
// 1,20,400,
// 1,20.75,430.5625,
// 1,21.5,462.25,
// 1,12,144,
// 1,18,324,
// 1,20,400,
// 1,20,400,
// 1,24,576,
// 1,24,576,
// 1,15.5,240.25,
// 1,14.5,210.25,
// 1,15,225,
// 1,22,484,
// 1,22,484,
// 1,17.5,306.25,
// 1,25,625,
// 1,19.75,390.0625,
// 1,14.75,217.5625,
// 1,15,225,
// 1,20.25,410.0625,
// 1,21,441,
// 1,18,324,
// 1,9,81,
// 1,15,225,
// 1,14,196,
// 1,14.75,217.5625,
// 1,6,36,
// 1,18,324,
// 1,18,324,
// 1,18.25,333.0625], 91, 3, [764.51,
// -138.5,
// 17.29,
// 429.12,
// 327.58,
// 327.6,
// 388.01,
// 404.48,
// -216,
// -8.61,
// 891,
// 137.62,
// 206.61,
// 453.79,
// 27,
// 0,
// -25.83,
// 638.45,
// 840.72,
// 746.98,
// 206.6,
// 804.57,
// -25.53,
// 523.35,
// 921.27,
// 234.11,
// 560.07,
// 710.89,
// 40.82,
// -122.99,
// -25,
// 599.07,
// 926.58,
// 35.77,
// 608.3,
// 511.17,
// -198,
// 180,
// 705.61,
// 519.89,
// 801.8,
// 521.92,
// 514.69,
// 540,
// 710.98,
// 707.16,
// 621.49,
// 533.51,
// 644.32,
// 720,
// 464.98,
// 688.75,
// 932,
// 528.29,
// 882,
// 261.78,
// 539.9,
// 241.09,
// 478.67,
// 716.32,
// 602.55,
// 712.7,
// 356.45,
// 373.17,
// 432,
// 547.92,
// 630.36,
// 557.26,
// 398.36,
// 177.96,
// 172.73,
// -101.74,
// 468,
// 763.15,
// 663.91,
// 253.13,
// 534.38,
// 252.94,
// 459.7,
// 368.08,
// 400.71,
// 535.05,
// 232.08,
// 317.99,
// 389.87,
// 234,
// 501.18,
// 216,
// 169.79,
// 381.29,
// 75.75]);
//     x = - x[1] / (2 * x[2]);
//     console.log(x);
