
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Project = mongoose.model('Project')
var utils = require('../../lib/utils')
var extend = require('util')._extend

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
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  project.user = req.user;
  project.uploadAndSave(images, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created project!');
      return res.redirect('/projects/'+project._id);
    }
    console.log(err);
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
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  // make sure no one changes the user
  delete req.body.user;
  project = extend(project, req.body);

  project.uploadAndSave(images, function (err) {
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
  res.render('projects/show', {
    title: req.project.title,
    project: req.project
  });
};

/**
 * Delete an project
 */

exports.destroy = function (req, res){
  var project = req.project;
  project.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/projects');
  });
};
