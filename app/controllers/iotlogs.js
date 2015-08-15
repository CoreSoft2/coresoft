

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');

/**
 * Load iotlogs
 */

exports.load = function (req, res, next, id) {
  var project = req.project;
  utils.findByParam(project.iotlogs, { id: id }, function (err, iotlog) {
    if (err) return next(err);
    req.iotlog = iotlog;
    next();
  });
};

/**
 * Create iotlog
 */

exports.create = function (req, res) {
  var project = req.project;
  var user = req.user;
  if (!req.body.body) return res.redirect('/projects/'+ project.id);

  project.addIotlog(user, req.body, function (err) {
    if (err) return res.render('500');
    res.redirect('/projects/'+ project.id);
  });
}

/**
 * Delete iotlog
 */

exports.destroy = function (req, res) {
  var project = req.project;
  project.removeIotlog(req.param('iotlogId'), function (err) {
    if (err) {
      req.flash('error', 'Oops! The IOT log was not found');
    } else {
      req.flash('info', 'Removed IOT LOG');
    }
    res.redirect('/projects/' + project.id);
  });
};
