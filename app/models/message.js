
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');
var Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
  projectid: {type : String, default : '', trim : true},
  subject: {type : String, default : '', trim : true},
  message: {type : String, default : '', trim : true},
  delivered: {type : Boolean, default : false, trim : true},
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Methods
 */
MessageSchema.methods = {
      addNew: function(projectid, subject, message, cb){
      this.message = message;
      this.subject = subject;
      this.projectid = projectid;
      this.save(cb);
  }
}

/** 
 * Statics
 */
MessageSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('project', 'title')
      .exec(cb);
  },

  /**
   * List Messages
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  list: function (options, cb) {
    var criteria = options.criteria || {"projectid" : options.projectid}

    this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

  /**
   * List One Message
   */
  findMessage: function (options, cb) {
    var criteria = options.criteria || {"proejctid" : options.projectid }
    this.findOne(criteria)
      .exec(cb);
  }
}

mongoose.model('Message', MessageSchema);
