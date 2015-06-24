/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Project = mongoose.model('Project');

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') };
  var perPage = 5;
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Project.list(options, function(err, projects) {
    if (err) return res.render('500');
    Project.count(criteria).exec(function (err, count) {
      res.render('projects/index', {
        title: 'Projects tagged ' + req.param('tag'),
        projects: projects,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
