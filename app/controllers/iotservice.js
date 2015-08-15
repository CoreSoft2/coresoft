

/**
 * IOT Service Module dependencies.
 */

var mongoose = require('mongoose');
var Project = mongoose.model('Project')
var winston = require('winston');

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
    // auth..
    
    /* send file
    
 var file = __dirname + '/upload-folder/dramaticpenguin.MOV';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);

  // alterntive*/
    
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
