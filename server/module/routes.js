"use strict";

const conf = require('../../config'); //Config module
const Boom = require('boom');
const _ = require('lodash'); // Helper function library
const queryString = require('querystring'); // Json to form encoded querystring
const log = require('../../lib/logger');
const build = require('../../build.json');

var knex = require('knex')({
    client: conf.get('database.client'),
    connection: {
    host: conf.get('database.host'),
    user: conf.get('database.username'),
    password: conf.get('database.password'),
    database: conf.get('database.schema'),
  }
});

var knex2 = require('knex')({
    client: conf.get('database.client'),
    connection: {
    host: conf.get('database.host'),
    user: conf.get('database.username2'),
    password: conf.get('database.password2'),
    database: conf.get('database.schema'),
  }
});


var vin = -1;
var vehicle_context_id = -1;
var user_fk = [];
var users = [];
var VehicleData = [];
var VehicleResult = [];
var TCUData = [];
var TCUResult = [];
var newVResult = [];
var newTResult = [];
var responseTime = [];

var monthNames = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sept",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
};

var operations = {
  "lock": [],
  "unlock": [],
  "honk": [],
  "flash": [],
  "climate": [],
  "engine": []
}

var tempOperationResults = [];
var operationResults = [];
var finalOperationResults = [];

Date.prototype.getMonthName = function() {
   return this.monthNames[this.getMonth()];
};

var now = new Date;

var date_sort_asc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

var dateSort = function comp(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

module.exports = function() {
  return [{
     method: 'GET',
     path: '/totals/{timeframe}',
     handler: function(request, reply) {

      var userinput = request.params.timeframe;

      var finalDate;

       if(userinput == 'week'){
         finalDate = new Date(now);
         finalDate.setDate(finalDate.getUTCDate()-7);
       }
       else if(userinput == 'month'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-1);

       }
       else if(userinput == 'quarter'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-3);
       }
       else if(userinput == '6months'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-6);
       }else if(userinput == 'year'){
         finalDate = new Date(now);
         finalDate.setFullYear(finalDate.getFullYear()-1);
       }

       //SQL query for total provisioned vehicles
       knex('VEHICLE_CONTEXT').select('MAINT_LAST_TS')
       .then((results)=>{

         if(VehicleData.length != 0){
           VehicleData = [];
         }

         if(VehicleResult.length != 0){
           VehicleResult = [];
         }

         VehicleData = results;
         for(var i=0; i < VehicleData.length; i++){
           var temp = new Date(VehicleData[i].MAINT_LAST_TS.toString());
           VehicleData[i] = temp;
         }

         VehicleData.sort(date_sort_asc);


         for(var j=0; j < VehicleData.length; j++){
           if(VehicleData[j] >= finalDate && VehicleData[j] <= now){
             VehicleResult.push(VehicleData[j].toISOString().substring(0,10));
           }
         }


         if(userinput == '6months' || userinput == 'year'){

          var tempResult = [];

              for(var i=0; i < VehicleResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(VehicleResult[i].substring(0, 8) == tempResult[j].date.substring(0, 8)){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": VehicleResult[i],
                      "totalNumber": 1
                    });
                }

             }

             for(var i=0; i < tempResult.length; i++){
                var year = new Date(tempResult[i].date).getFullYear() 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + year;
             }

             newVResult = tempResult;

         }
         else{
             var tempResult = [];

             for(var i=0; i < VehicleResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(VehicleResult[i] == tempResult[j].date){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": VehicleResult[i],
                      "totalNumber": 1
                    });
                }

             }

            for(var i=0; i < tempResult.length; i++){
                var date = new Date(tempResult[i].date).getUTCDate(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + date;
             }

             newVResult = tempResult;

          }

          //SQL query for total provisioned TCUs
          return knex('TCU_DATA').select('MAINT_LAST_TS');

          }).then((results)=>{


            if(TCUData.length != 0){
            TCUData = [];
          }

          if(TCUResult.length != 0){
            TCUResult = [];
          }

          TCUData = results;

          for(var i=0; i < TCUData.length; i++){
            var temp = new Date(TCUData[i].MAINT_LAST_TS.toString());
            TCUData[i] = temp;
          }

          TCUData.sort(date_sort_asc);

          for(var j=0; j < TCUData.length; j++){
            if(TCUData[j] >= finalDate && TCUData[j] <= now){
              TCUResult.push(TCUData[j].toISOString().substring(0,10));
            }
          }


          if(userinput == '6months' || userinput == 'year'){

          var tempResult = [];

              for(var i=0; i < TCUResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(TCUResult[i].substring(0, 8) == tempResult[j].date.substring(0, 8)){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                 }

                if(temp == false){
                    tempResult.push({
                      "date": TCUResult[i],
                      "totalNumber": 1
                    });
                }

             }

             for(var i=0; i < tempResult.length; i++){
                var year = new Date(tempResult[i].date).getFullYear(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + year;
             }

             newTResult = tempResult;

         }
         else{
             var tempResult = [];

             for(var i=0; i < TCUResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(TCUResult[i] == tempResult[j].date){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": TCUResult[i],
                      "totalNumber": 1
                    });
                }

             }

            for(var i=0; i < tempResult.length; i++){
                var date = new Date(tempResult[i].date).getUTCDate(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + date;
             }

             newTResult = tempResult;

         }

         var finalData = [];
         
          for(var v=0; v < newVResult.length; v++){
            for(var t=0; t < newTResult.length; t++){
              if(newVResult[v].date == newTResult[t].date){

                finalData.push({
                  "date" : newVResult[v].date,
                  "Provisioned Vehicles" : newVResult[v].totalNumber,
                  "Provisioned TCUs" : newTResult[t].totalNumber
                });
              }
            }
          }

          for(var t=0; t < newTResult.length; t++){
            var temp = false;
            for(var f=0; f < finalData.length; f++){
                if(newTResult[t].date == finalData[f].date){
                  temp = true;
                }
            }

            if(temp == false){
                finalData.push({
                  "date" : newTResult[t].date,
                  "Provisioned Vehicles" : 0,
                  "Provisioned TCUs" : newTResult[t].totalNumber
                });
            }
          }

          for(var v=0; v < newVResult.length; v++){
            var temp = false;
            for(var f=0; f < finalData.length; f++){
                if(newVResult[v].date == finalData[f].date){
                  temp = true;
                }
            }

            if(temp == false){
                finalData.push({
                  "date" : newVResult[v].date,
                  "Provisioned Vehicles" : newVResult[v].totalNumber,
                  "Provisioned TCUs" : 0
                });
            }
          }

            return reply({
              Total_Provisioned_Vehicles: VehicleResult.length,
              Total_TCU_Vehicles: TCUResult.length,
              data: finalData
            });

       })
     } //end handler
    },{
     method: 'GET',
     path: '/VehicleTotals/{timeframe}',
     handler: function(request, reply) {

      var userinput = request.params.timeframe;

      var finalDate;

       if(userinput == 'week'){
         finalDate = new Date(now);
         finalDate.setDate(finalDate.getUTCDate()-7);
       }
       else if(userinput == 'month'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-1);

       }
       else if(userinput == 'quarter'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-3);
       }
       else if(userinput == '6months'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-6);
       }else if(userinput == 'year'){
         finalDate = new Date(now);
         finalDate.setFullYear(finalDate.getFullYear()-1);
       }

       //SQL query for total provisioned vehicles
       knex('VEHICLE_CONTEXT').select('MAINT_LAST_TS')
       .then((results)=>{

         if(VehicleData.length != 0){
           VehicleData = [];
         }

         if(VehicleResult.length != 0){
           VehicleResult = [];
         }

         VehicleData = results;
         for(var i=0; i < VehicleData.length; i++){
           var temp = new Date(VehicleData[i].MAINT_LAST_TS.toString());
           VehicleData[i] = temp;
         }

         VehicleData.sort(date_sort_asc);


         for(var j=0; j < VehicleData.length; j++){
           if(VehicleData[j] >= finalDate && VehicleData[j] <= now){
             VehicleResult.push(VehicleData[j].toISOString().substring(0,10));
           }
         }

         var newResult = [];

         if(userinput == '6months' || userinput == 'year'){

          var tempResult = [];

              for(var i=0; i < VehicleResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(VehicleResult[i].substring(0, 8) == tempResult[j].date.substring(0, 8)){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": VehicleResult[i],
                      "totalNumber": 1
                    });
                }

             }

             for(var i=0; i < tempResult.length; i++){
                var year = new Date(tempResult[i].date).getFullYear() 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + year;
             }

             newResult = tempResult;

         }
         else{
             var tempResult = [];

             for(var i=0; i < VehicleResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(VehicleResult[i] == tempResult[j].date){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": VehicleResult[i],
                      "totalNumber": 1
                    });
                }

             }

            for(var i=0; i < tempResult.length; i++){
                var date = new Date(tempResult[i].date).getUTCDate(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + date;
             }

             newResult = tempResult;

          }

            return reply({
              Total_Provisioned_Vehicles: VehicleResult.length,
              Provisioned_Vehicles_Data: newResult
            });
       })
     } //end handler
    },
    {
      method: 'GET',
      path: '/TCUTotals/{timeframe}',
      handler: function(request, reply) {

       var userinput = request.params.timeframe;

       var finalDate;

        if(userinput == 'week'){
          finalDate = new Date(now);
          finalDate.setDate(finalDate.getUTCDate()-7);
        }
        else if(userinput == 'month'){
          finalDate = new Date(now);
          finalDate.setMonth(finalDate.getMonth()-1);

        }
        else if(userinput == 'quarter'){
          finalDate = new Date(now);
          finalDate.setMonth(finalDate.getMonth()-3);
        }
        else if(userinput == '6months'){
          finalDate = new Date(now);
          finalDate.setMonth(finalDate.getMonth()-6);
        }else if(userinput == 'year'){
          finalDate = new Date(now);
          finalDate.setFullYear(finalDate.getFullYear()-1);
        }

        //SQL query for total TCU vehicles
        knex('TCU_DATA').select('MAINT_LAST_TS')
        .then((results)=>{

          if(TCUData.length != 0){
            TCUData = [];
          }

          if(TCUResult.length != 0){
            TCUResult = [];
          }

          TCUData = results;

          for(var i=0; i < TCUData.length; i++){
            var temp = new Date(TCUData[i].MAINT_LAST_TS.toString());
            TCUData[i] = temp;
          }

          TCUData.sort(date_sort_asc);

          for(var j=0; j < TCUData.length; j++){
            if(TCUData[j] >= finalDate && TCUData[j] <= now){
              TCUResult.push(TCUData[j].toISOString().substring(0,10));
            }
          }

          var newResult = [];

          if(userinput == '6months' || userinput == 'year'){

          var tempResult = [];

              for(var i=0; i < TCUResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(TCUResult[i].substring(0, 8) == tempResult[j].date.substring(0, 8)){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                 }

                if(temp == false){
                    tempResult.push({
                      "date": TCUResult[i],
                      "totalNumber": 1
                    });
                }

             }

             for(var i=0; i < tempResult.length; i++){
                var year = new Date(tempResult[i].date).getFullYear(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + year;
             }

             newResult = tempResult;

         }
         else{
             var tempResult = [];

             for(var i=0; i < TCUResult.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(TCUResult[i] == tempResult[j].date){
                    tempResult[j].totalNumber++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": TCUResult[i],
                      "totalNumber": 1
                    });
                }

             }

            for(var i=0; i < tempResult.length; i++){
                var date = new Date(tempResult[i].date).getUTCDate(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + date;
             }

             newResult = tempResult;

         }

             return reply({
               Total_Provisioned_TCUs: TCUResult.length,
               Provisioned_TCUs_Data: newResult
             });

        })
      } //end handler
  },
  {
     method: 'GET',
     path: '/pie/{timeframe}',
     handler: function(request, reply) {

      operations.lock = [];
      operations.unlock = []; 
      operations.honk = [];
      operations.flash = [];
      operations.climate = [];
      operations.engine = [];

      var userinput = request.params.timeframe;

      var finalDate;

       if(userinput == 'week'){
         finalDate = new Date(now);
         finalDate.setDate(finalDate.getUTCDate()-7);
       }
       else if(userinput == 'month'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-1);

       }
       else if(userinput == 'quarter'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-3);
       }
       else if(userinput == '6months'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-6);
       }else if(userinput == 'year'){
         finalDate = new Date(now);
         finalDate.setFullYear(finalDate.getFullYear()-1);
       }

       knex2('RMT_OP').select('*')
       .then((results)=>{

        for(var i=0; i < results.length; i++){
          if(results[i].OP_NME == "doorLock"){
            operations.lock.push({
              "date": results[i].STRT_TMST.toString()
            });
          }
          else if(results[i].OP_NME == "doorUnlock"){
            operations.unlock.push({
              "date": results[i].STRT_TMST.toString()
            });
          }
          else if(results[i].OP_NME == "horn"){
            operations.honk.push({
              "date": results[i].STRT_TMST.toString()
            });
          }
          else if(results[i].OP_NME == "lights"){
            operations.flash.push({
              "date": results[i].STRT_TMST.toString()
            });
          }
          else if(results[i].OP_NME == "remoteAC"){
            operations.climate.push({
              "date": results[i].STRT_TMST.toString()
            });
          }
          else if(results[i].OP_NME == "engineOff"){
            operations.engine.push({
              "date": results[i].STRT_TMST.toString()
            });
          }
            
        }

        for(var i=0; i < operations.length; i++){
            operations[i].sort(date_sort_asc);
            var temp = [];
            for(var j=0; j < operations[i].length; j++){
                if(operations[i][j].date >= finalDate && operations[i][j].date <= now){
                  temp.push(operations[i][j].date);
                }
            }
            operations[i] = temp;
        }

        var total = operations.lock.length+operations.unlock.length+operations.honk.length+operations.flash.length+operations.climate.length+operations.engine.length;
         
        return reply({
          "total" : total,
          "pieData" : 
              [
                {"name": "Door Lock",
                "value": operations.lock.length
                },
                {
                "name": "Door Unlock",
                "value": operations.unlock.length
                },
                {
                "name": "Honk",
                "value": operations.honk.length
                },
                {
                "name": "Flash",
                "value": operations.flash.length
                },
                {
                "name": "Climate control",
                "value": operations.climate.length
                },
                {
                "name": "Engine off",
                "value": operations.engine.length
                }
              ]
            });
       })
     } //end handler
    },
    {
     method: 'GET',
     path: '/{operation}/{timeframe}',
     handler: function(request, reply) {
      var userinput = request.params.timeframe;

      var finalDate;

      tempOperationResults = [];

       if(userinput == 'week'){
         finalDate = new Date(now);
         finalDate.setDate(finalDate.getUTCDate()-7);
       }
       else if(userinput == 'month'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-1);

       }
       else if(userinput == 'quarter'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-3);
       }
       else if(userinput == '6months'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-6);
       }else if(userinput == 'year'){
         finalDate = new Date(now);
         finalDate.setFullYear(finalDate.getFullYear()-1);
       }

       knex2('RMT_OP').select('*')
       .then((results)=>{

        
          for(var i=0; i < results.length; i++){
            if(results[i].OP_NME == request.params.operation){
              var temp = new Date(results[i].STRT_TMST.toString());
              tempOperationResults.push(temp);
            }  
          }


        tempOperationResults.sort(date_sort_asc);
        operationResults = [];

        for(var j=0; j < tempOperationResults.length; j++){
           if(tempOperationResults[j] >= finalDate && tempOperationResults[j] <= now ){
             operationResults.push(tempOperationResults[j].toISOString().substring(0,10));
           }
         }

        if(userinput == '6months' || userinput == 'year'){

          var tempResult = [];
              for(var i=0; i < operationResults.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(operationResults[i].toString().substring(0, 8) == tempResult[j].date.toString().substring(0, 8)){
                    tempResult[j].Times++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": operationResults[i],
                      "Times": 1
                    });
                }

             }

             for(var i=0; i < tempResult.length; i++){
                var year = new Date(tempResult[i].date).getFullYear();
                var month = monthNames[tempResult[i].date.toString().substring(5,7)];
                tempResult[i].date = month + " " + year;
             }

             operationResults = tempResult;

         }
         else{
             var tempResult = [];
             

             for(var i=0; i < operationResults.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(operationResults[i] == tempResult[j].date){
                    tempResult[j].Times++;
                    temp = true;
                  }
                }

                if(temp == false){
                    tempResult.push({
                      "date": operationResults[i],
                      "Times": 1
                    });
                }

             }

            for(var i=0; i < tempResult.length; i++){
                var date = new Date(tempResult[i].date).getUTCDate(); 
                var month = monthNames[tempResult[i].date.toString().substring(5,7)];
                tempResult[i].date = month + " " + date;
             }

             operationResults = tempResult;

          }
           return reply({
              "dataLength": operationResults.length,
              "data": operationResults
            });
       })
     } //end handler
    },
  {
    method: 'GET',
    path: '/responseTime/{operation}/{timeframe}', //This must be restricted eventually
    handler: function(request, reply) {

      var userinput = request.params.timeframe;

      var finalDate;

       if(userinput == 'week'){
         finalDate = new Date(now);
         finalDate.setDate(finalDate.getUTCDate()-7);
       }
       else if(userinput == 'month'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-1);

       }
       else if(userinput == 'quarter'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-3);
       }
       else if(userinput == '6months'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-6);
       }else if(userinput == 'year'){
         finalDate = new Date(now);
         finalDate.setFullYear(finalDate.getFullYear()-1);
       }
       var responseResults = [];
       var responseTimes = [];

      knex2.select('*').where({
        OP_NME: request.params.operation
      }).from('RMT_OP')
      .then((results)=>{

        for(var j=0; j < results.length; j++){
          
          if(results[j].STRT_TMST >= finalDate && results[j].STRT_TMST <= now 
            && results[j].END_TMST >= finalDate && results[j].END_TMST <= now ){
             responseResults.push({
              date: results[j].STRT_TMST.toISOString().substring(0,10),
              time: (results[j].END_TMST-results[j].STRT_TMST)/1000
           });
        }
      }

        responseResults.sort(dateSort);

        var tempResult = [];
        var aboveAverage = [];
        var aboveExpected = [];

        if(userinput == '6months' || userinput == 'year'){

              for(var i=0; i < responseResults.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(responseResults[i].date.toString().substring(0, 8) == tempResult[j].date.toString().substring(0, 8)){
                    temp = true;
                    tempResult[j]["diff"].push(responseResults[i].time);
                  }
                }

                  if(temp == false){

                      tempResult.push({
                        "date": responseResults[i].date,
                        "diff": []
                      });

                  tempResult[tempResult.length-1]["diff"].push(responseResults[i].time);
                }

             }
             for(var x=0; x < tempResult.length; x++){
                  var year = new Date(tempResult[x].date).getFullYear(); 
                  var month = monthNames[tempResult[x].date.toString().substring(5,7)];
                  tempResult[x].date = month + " " + year;
             }

            }
        else if(userinput == 'week' || userinput == 'month' || userinput == 'quarter'){
              for(var i=0; i < responseResults.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(responseResults[i].date.toString() == tempResult[j].date.toString()){
                    temp = true;
                    tempResult[j]["diff"].push(responseResults[i].time);
                  }
                }

                  if(temp == false){
                      
                      tempResult.push({
                        "date": responseResults[i].date,
                        "diff": []
                      });

                  tempResult[tempResult.length-1]["diff"].push(responseResults[i].time);
                }
            }

            for(var x=0; x < tempResult.length; x++){
                  var date = new Date(tempResult[x].date).getUTCDate(); 
                  var month = monthNames[tempResult[x].date.toString().substring(5,7)];
                  tempResult[x].date = month + " " + date;
            }

        }

        var finalResults = [];

        for(var a=0; a < tempResult.length; a++){
          var max = tempResult[a]["diff"][0];
          var sum = 0;
          var ave = 0;
          for(var b=0; b < tempResult[a]["diff"].length; b++){
            if(tempResult[a]["diff"][b] > max){
              max = tempResult[a]["diff"][b]
            }

            sum = sum + tempResult[a]["diff"][b];
          }



          ave = sum/tempResult[a]["diff"].length;

          finalResults.push({
            date: tempResult[a].date,
            Max: max,
            Average: ave
          });

        }

        var aboveAverageCount = 0;
        var aboveExpectedCount = 0;
        var sum = 0;

        for(var y=0; y < responseResults.length; y++){
          sum = sum + responseResults[y].time;
        }

        var totalAve = sum/responseResults.length;

        for(var x=0; x < responseResults.length; x++){
          if(responseResults[x].time > totalAve){
            aboveAverageCount++;
          }
        }

        aboveAverage.push({
          name: "Average response time",
          value: aboveAverageCount
        },
          {
          name: "Average response time",
          value: responseResults.length-aboveAverageCount //total
        });

        var expected= 6.1;

        for(var x=0; x < responseResults.length; x++){
          if(responseResults[x].time > expected){
            aboveExpectedCount++;
          }
        }

        aboveExpected.push({
          name: "Expected response time",
          value: aboveExpectedCount
        },
        {
          name: "Expected response time",
          total: responseResults.length-aboveExpectedCount //total
        });

        return reply({
          data: finalResults,
          aboveAverage: aboveAverage,
          aboveExpected: aboveExpected
        });
      })
    } //end handler
  },
  {
    method: 'GET',
    path: '/incidents/{operation}/{timeframe}', //This must be restricted eventually
    handler: function(request, reply) {

      var userinput = request.params.timeframe;
      var incidentType = request.params.operation;

      var finalDate;

       if(userinput == 'week'){
         finalDate = new Date(now);
         finalDate.setDate(finalDate.getUTCDate()-7);
       }
       else if(userinput == 'month'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-1);

       }
       else if(userinput == 'quarter'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-3);
       }
       else if(userinput == '6months'){
         finalDate = new Date(now);
         finalDate.setMonth(finalDate.getMonth()-6);
       }else if(userinput == 'year'){
         finalDate = new Date(now);
         finalDate.setFullYear(finalDate.getFullYear()-1);
       }

       var responseResults = [];
     knex2.select('*').where({
        OP_NME: incidentType
      }).from('RMT_OP')
      .then((results)=>{

      for(var j=0; j < results.length; j++){
          
          if(results[j].STRT_TMST >= finalDate && results[j].STRT_TMST <= now 
            && results[j].END_TMST >= finalDate && results[j].END_TMST <= now ){
             responseResults.push(results[j].STRT_TMST.toISOString().substring(0,10));
        }
      }

        responseResults.sort(date_sort_asc);

        var newResult = [];

        if(userinput == '6months' || userinput == 'year'){

          var tempResult = [];

              for(var i=0; i < responseResults.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(responseResults[i].substring(0, 8) == tempResult[j].date.substring(0, 8)){
                    tempResult[j].Times++;
                    temp = true;
                  }
                 }

                if(temp == false){
                    tempResult.push({
                      "date": responseResults[i],
                      "Times": 1
                    });
                }

             }

             for(var i=0; i < tempResult.length; i++){
                var year = new Date(tempResult[i].date).getFullYear(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + year;
             }

             newResult = tempResult;

         }
         else{
             var tempResult = [];

             for(var i=0; i < responseResults.length; i++){
                var temp = false;
                for(var j=0; j < tempResult.length; j++){
                  if(responseResults[i] == tempResult[j].date){
                    tempResult[j].Times++;
                    temp = true;
                  }
              }

                if(temp == false){
                    tempResult.push({
                      "date": responseResults[i],
                      "Times": 1
                    });
                }

             }

            for(var i=0; i < tempResult.length; i++){
                var date = new Date(tempResult[i].date).getUTCDate(); 
                var month = monthNames[tempResult[i].date.substring(5,7).toString()];
                tempResult[i].date = month + " " + date;
             }

             newResult = tempResult;
           }

            return reply({
               total: responseResults.length,
               data: newResult
             });

        });
      }//end handler
  },
  {
    method: 'GET',
    path: '/about', //This must be restricted eventually
    handler: function(request, reply) {
      var about = {
        "name": process.env.npm_package_name,
        "version": process.env.npm_package_version,
        "buildKey":  build.buildKey,
        "buildNumber": build.buildNumber,
        "config": conf.getProperties()
      }
      return reply(about);
    }
  }, {
    method: 'GET',
    path: '/restricted',
    config: {
      auth: 'jwt'
    },
    handler: function(request, reply) {
      return reply("ACCESS ALLOWED");
    }
  }, {
    method: 'GET',
    path: '/adminonly',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      }
    },
    handler: function(request, reply) {
      return reply("ACCESS ALLOWED");
    }
  }, {
    method: 'GET',
    path: '/techoraccountantonly',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['technical', 'accountant']
      }
    },
    handler: function(request, reply) {
      return reply("ACCESS ALLOWED");
    }
  }]
}();
