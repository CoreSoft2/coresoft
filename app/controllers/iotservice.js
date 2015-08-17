

/**
 * IOT Service Module dependencies.
 */

var mongoose = require('mongoose');
var Project = mongoose.model('Project')
var Message = mongoose.model('Message')

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
      var data = '{"ipgateway":"'+iotproject.ipgateway
      +'", "ipaddress":"'+iotproject.ipaddress
      +'","wifipasskey":"'+iotproject.wifipasskey
      +'","wifissid":"'+iotproject.wifissid
      +'","iptype":"'+iotproject.iptype
      +'","title":"'+iotproject.title
      +'","desctiption":"'+iotproject.body
      +'","deviceid":"'+iotproject.deviceid + '"}';
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
      if (iotproject && iotproject.image.files){
        var file = '/tmp/' + iotproject.image.files;
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
            iotproject.addLog(log, function (err) {
                if (err) res.send('ERR');
                else res.send('OK');
                });
      }
  })
}

exports.newmessage = function (req, res){
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
      if (iotproject && iotproject.id){
           
          var messaeg = new Message({ 'proejctid': iotproject.id, 'subject': subject, 'message': message });
            messaeg.save( function (err) {
                if (err) res.send('ERR');
                else res.send('OK');
                });
      }
  })
}