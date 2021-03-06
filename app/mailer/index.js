
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Notifier = require('notifier');
var config = require('config');

/**
 * Process the templates using swig - refer to notifier#processTemplate method
 *
 * @param {String} tplPath
 * @param {Object} locals
 * @return {String}
 * @api public
 */

Notifier.prototype.processTemplate = function (tplPath, locals) {
  var swig = require('swig');
  locals.filename = tplPath;
  return swig.renderFile(tplPath, locals);
};

/**
 * Expose
 */

module.exports = {

  /**
   * Comment notification
   *
   * @param {Object} options
   * @param {Function} cb
   * @api public
   */

  iotlog: function (options, cb) {
    var project = options.project;
    var author = options.currentUser;
    var user = options.currentUser;
    var notifier = new Notifier(config.notifier);

    var obj = {
      to: author.email,
      from: 'info@pivotsecurity.com',
      subject: user.name,
      alert: user.name + ' added: "' + options.iotlog,
      locals: {
        to: author.name,
        from: user.name,
        body: options.iotlog,
        project: project
      }
    };

    // for apple push notifications
    /*notifier.use({
      APN: true
      parseChannels: ['USER_' + author._id.toString()]
    })*/

    try {
      notifier.send('iotlog', obj, cb);
    } catch (err) {
      console.log(err);
    }
  }
};
