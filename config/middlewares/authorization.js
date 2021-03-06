
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
}

/*
 *  project authorization routing middleware
 */

exports.project = {
  hasAuthorization: function (req, res, next) {
    if (req.project.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/projects/' + req.project.id)
    }
    next()
  }
}

/**
 * Comment authorization routing middleware
 */

exports.requiresApiAuth = function (req, res, next) {
    // if the current user is iotlog owner or project owner
    // give them authority to delete
      
    if (req.query.deviceid !== '' && req.query.apikey !== '') {
      next()
    } else {
      req.flash('info', 'You are not authorized')
      res.redirect('/projects/' + req.project.id)
    }
}
