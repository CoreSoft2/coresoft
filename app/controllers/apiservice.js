

/**
 * IOT Service Module dependencies.
 */

var mongoose = require('mongoose');
var winston = require('winston');
var Project = mongoose.model('Project')


exports.initiot = function (req, res) {
  var project = req.project;
  var user = req.user;

    res.write(JSON.stringify(project));

}
