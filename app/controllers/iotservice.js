/**
 * IOT Service Module dependencies.
 */

var mongoose = require('mongoose');
var Project = mongoose.model('Project')
var Message = mongoose.model('Message')
var url = require('url')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var path = require('path')

exports.initiot = function (req, res) {
  var devid = req.query.deviceid;
  var apikey = req.query.apikey;
  var apipass = req.query.apisecret;
    
  // Authenticate
  var options = {
    deviceid: devid,
    apikey: apikey,
    apipass : apipass
  };
    
  Project.findProject(options, function(err, iotproject){
      
      var data = 'EP01: Invaild credentials';
      
      if(iotproject){
      
      data = '{"ipgateway":"'+iotproject.ipgateway
      +'", "ipaddress":"'+iotproject.ipaddress
      +'","wifipasskey":"'+iotproject.wifipasskey
      +'","wifissid":"'+iotproject.wifissid
      +'","iptype":"'+iotproject.iptype
      +'","title":"'+iotproject.title
      +'","desctiption":"'+iotproject.body
      +'","deviceid":"'+iotproject.deviceid + '"}';
          }
      res.send(data);
    }) 
}

exports.getiotimage = function (req, res){
  var devid = req.query.deviceid;
  var apikey = req.query.apikey;
  var apisecret = req.query.apisecret;
    
  // Authenticate
  var options = {
    deviceid: devid,
    apikey: apikey,
    apisecret : apisecret
  };
  Project.findProject(options, function(err, iotproject){
      if (iotproject && iotproject.image.files && iotproject.user){
          global.appRoot = path.resolve(__dirname);
          var file = global.appRoot + "/../../data/" + iotproject.user + '/'+ iotproject.image.files;
          res.download(file); // Set disposition and send it.
      }else{
          res.send("EP01: Invaild credentials");
      }
  })
}

exports.addlog = function (req, res){
  var devid = req.query.deviceid;
  var apikey = req.query.apikey;
  var apisecret = req.query.apisecret;
  var log = req.query.log;
    
  // Authenticate
  var options = {
    deviceid: devid,
    apikey: apikey,
    apisecret : apisecret
  };
  Project.findProject(options, function(err, iotproject){
      if (iotproject){
            iotproject.addLog(log,false, function (err) {
                if (err) res.send('EP01: Invaild credentials');
                else res.send('OK');
                });
      }else{
          res.send("PP01: Project not found");
      }
  })
}

exports.adderror = function (req, res){
  var devid = req.query.deviceid;
  var apikey = req.query.apikey;
  var apisecret = req.query.apisecret;
  var log = req.query.log;
    
  // Authenticate
  var options = {
    deviceid: devid,
    apikey: apikey,
    apisecret : apisecret
  };
  Project.findProject(options, function(err, iotproject){
      if (iotproject){
            iotproject.addLog(log, true, function (err) {
                if (err) res.send('EP01: Invaild credentials');
                else res.send('OK');
                });
      }else{
          res.send("PP01: Project not found");
      }
  })
}
exports.newmessage = function (req, res){
    
//var parsedUrl = url.parse(req.url, true)

  var devid = req.query.deviceid;
  var apikey = req.query.apikey;
  var apisecret = req.query.apisecret;
  var subject = req.query.subject;
  var message = req.query.message;

  // Authenticate
  var options = {
    deviceid: devid,
    apikey: apikey,
    apisecret : apisecret
  };
  Project.findProject(options, function(err, iotproject){
      if (iotproject && iotproject.id && iotproject.user.email){
           
          var messaeg = new Message({ 'proejctid': iotproject.id, 'subject': subject, 'message': message });
            messaeg.addNew(iotproject.id,subject, message, function(err){console.log(err)});
            messaeg.save( function (err) {
                if (err) res.send('EP02: Generic Error');
                else{ 
                    utils.sendPushMessage(iotproject.user.email, subject, message);   
                    res.send('OK');
                }
                });
      }else{
          res.send('EP01: Invaild credentials');
      }
  })
}