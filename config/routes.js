
/*!
 * Module dependencies.
 */

// Note: We can require users, projects and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var users = require('users');
var projects = require('projects');
var iotlogs = require('iotlogs');
var tags = require('tags');
var iotservice = require('iotservice');
var apiservice = require('apiservice');

var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

var projectAuth = [auth.requiresLogin, auth.project.hasAuthorization];
var iotlogsAuth = [auth.requiresLogin, auth.iotlog.hasAuthorization];
var iotApiAuth = [auth.requiresLogin, auth.iotapi.apiAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.get('/reset', users.reset);
  app.post('/users/forgot', users.forgot);
  app.get('/users/reset/:token', users.forgottoken);
  app.post('/users/resetpass', users.resetpass);
  app.post('/users', users.create);
    
  app.post('/users/session', passport.authenticate('local', { failureRedirect: '/login',  failureFlash: 'Invalid email or password.' }), users.session);
  app.get('/users/:userId', users.show);
    
  app.get('/auth/facebook',passport.authenticate('facebook', {scope: [ 'email', 'user_about_me'],failureRedirect: '/login'}), users.signin);
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), users.authCallback);
  app.get('/auth/github',passport.authenticate('github', {failureRedirect: '/login'}), users.signin);
  app.get('/auth/github/callback',passport.authenticate('github', {failureRedirect: '/login'}), users.authCallback);
  app.get('/auth/twitter',passport.authenticate('twitter', {failureRedirect: '/login'}), users.signin);
  app.get('/auth/twitter/callback',passport.authenticate('twitter', {failureRedirect: '/login' }), users.authCallback);
  app.get('/auth/google', passport.authenticate('google', {ailureRedirect: '/login', scope:  ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] }), users.signin);
  app.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/login'}), users.authCallback);
  app.get('/auth/linkedin',passport.authenticate('linkedin', {failureRedirect: '/login',scope: ['r_emailaddress']}), users.signin);
  app.get('/auth/linkedin/callback',passport.authenticate('linkedin', { failureRedirect: '/login' }), users.authCallback);

  app.param('userId', users.load);

  // project routes
  app.param('id', projects.load);
  app.get('/projects/index', projects.index);
  app.get('/projects/new', auth.requiresLogin, projects.new);
  app.post('/projects', auth.requiresLogin, projects.create);
  app.get('/projects/:id', projects.show);
  app.get('/projects/:id/edit', projectAuth, projects.edit);
  app.put('/projects/:id', projectAuth, projects.update);
  app.delete('/projects/:id', projectAuth, projects.destroy);

  // home route
  app.get('/', projects.home);

  // iotlogs routes
  app.param('iotlogId', iotlogs.load);
  app.post('/projects/:id/iotlogs', auth.requiresLogin, iotlogs.create);
  app.get('/projects/:id/iotlogs', auth.requiresLogin, iotlogs.create);
  app.delete('/projects/:id/iotlogs/:iotlogId', iotlogsAuth, iotlogs.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);

  // Weservice routes
  app.get('/iot/init', iotApiAuth, iotservice.initiot);
  app.get('/iot/getimage', iotApiAuth, iotservice.getiotimage);
  app.get('/iot/addlog', iotApiAuth, iotservice.addlog);
  app.get('/iot/adderror', iotApiAuth, iotservice.adderror);
  app.get('/iot/message', iotApiAuth, iotservice.newmessage);
    
  /**
   * Error handling
   */
  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}
