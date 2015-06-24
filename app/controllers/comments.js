
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');

/**
 * Load comment
 */

exports.load = function (req, res, next, id) {
  var project = req.project;
  utils.findByParam(project.comments, { id: id }, function (err, comment) {
    if (err) return next(err);
    req.comment = comment;
    next();
  });
};

/**
 * Create comment
 */

exports.create = function (req, res) {
  var project = req.project;
  var user = req.user;
  console.log(req.body);
  if (!req.body.body) return res.redirect('/projects/'+ project.id);

  project.addComment(user, req.body, function (err) {
    if (err) return res.render('500');
    res.redirect('/projects/'+ project.id);
  });
}

/**
 * Delete comment
 */

exports.destroy = function (req, res) {
  var project = req.project;
  project.removeComment(req.param('commentId'), function (err) {
    if (err) {
      req.flash('error', 'Oops! The comment was not found');
    } else {
      req.flash('info', 'Removed comment');
    }
    res.redirect('/projects/' + project.id);
  });
};
