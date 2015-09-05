
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Project = mongoose.model('Project')
var Message = mongoose.model('Message')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var url = require('url')

/**
 * Load
 */

exports.load = function (req, res, next, id){
  var User = mongoose.model('User');

  Project.load(id, function (err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('not found'));
    req.project = project;
    next();
  });
};

/**
 * List
 */

exports.home = function (req, res){
      res.render('index');
};

/**
 * List
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page,
    user : req.user
  };

  Project.list(options, function (err, projects) {
    if (err) return res.render('500');
    Project.count().exec(function (err, count) {
      res.render('projects/index', {
        title: 'Projects',
        projects: projects,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New project
 */

exports.new = function (req, res){
  res.render('projects/new', {
    title: 'New Project',
    project: new Project({})
  });
};

/**
 * Create an project
 * Upload an image
 */

exports.create = function (req, res) {
  var project = new Project(req.body);
  project.user = req.user;

  project.uploadAndSave(req, function (err) {
    if (!err) {
        req.flash('success', 'Successfully created project!');
        //create new account for the IF sub-system for display
        utils.setupVendor({'vendor' : 'test'},req, function(err){console.log(err)});
        return res.redirect('/projects/'+project._id);
    }
    res.render('projects/new', {
      title: 'New Project',
      project: project,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an project
 */

exports.edit = function (req, res) {
  res.render('projects/edit', {
    title: 'Edit ' + req.project.title,
    project: req.project
  });
};

/**
 * Update project
 */

exports.update = function (req, res){
  var project = req.project;
  // make sure no one changes the user
  delete req.body.user;
  project = extend(project, req.body);

  project.uploadAndSave(req, function (err) {
    if (!err) {
      return res.redirect('/projects/' + project._id);
    }

    res.render('projects/edit', {
      title: 'Edit Project',
      project: project,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show project
 */

exports.show = function (req, res){
  var parsedUrl = url.parse(req.url, true);
  var queryAsObject = parsedUrl.query;
  var page = parseInt(queryAsObject['page'] > 0 ? queryAsObject['page'] : 0);
  if(queryAsObject['prev']){page = page-1}
  if(queryAsObject['next']){page = page+1}
    
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page,
    projectid : req.project.id
  };

    messages: Message.list(options, function(err, messages){
        res.render('projects/show', {
        title: req.project.title,
        messages: messages,
        page : page,
        project: req.project
        });
    });
};

/**
 * Delete an project
 */

exports.destroy = function (req, res){
  var project = req.project;
  project.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/projects/index');
  });
};
