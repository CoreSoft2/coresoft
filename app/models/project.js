
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var config = require('config');
var uuid = require('node-uuid');
var fs = require('fs');

var imagerConfig = require(config.root + '/config/imager.js');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Getters
 */
var getTags = function (tags) {
  return tags.join(',');
};

/**
 * Setters
 */
var setTags = function (tags) {
  return tags.split(',');
};

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  deviceid: {type : String, default : '', trim : true},
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  vendorid: {type : String, default : '', trim : true},
  apikey: {type : String, default : uuid.v1(), trim : true},
  apisecret: {type : String, default : uuid.v4(), trim : true},
  datatype: {type : String, default : 'JSON', trim : true},
  datasample: {type : String, default : '', trim : true},
  iptype: {type : String, default : 'dynamic', trim : true},
  wifissid: {type : String, default : '', trim : true},
  wifipasskey: {type : String, default : '', trim : true},
  ipaddress: {type : String, default : '', trim : true},
  ipgateway: {type : String, default : '', trim : true},
  iotlogs: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    error: { type : Boolean, default : false },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */
ProjectSchema.path('title').required(true, 'Project title cannot be blank');
ProjectSchema.path('body').required(true, 'Project body cannot be blank');

/**
 * Pre-remove hook
 */
ProjectSchema.pre('remove', function (next) {
  var files = this.image.files;

  if (files){
      var path = require('path');
      global.appRoot = path.resolve(__dirname);
      fs.unlink(global.appRoot + "/../../data/" + this.user._id + '/' +files);
  }
  next();
});

/**
 * Methods
 */
ProjectSchema.methods = {

  /**
   * Save Project and upload image
   * 
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */
  uploadAndSave: function (req, cb) {
      
    if (req.files && req.files.image){
        fs.readFile(req.files.image.path, function (err, data) {
            var path = require('path');
            global.appRoot = path.resolve(__dirname);
            utils.ensureExists(global.appRoot + "/../../data/" + req.user.id, 0744, function(err) {
                if (err) console.log(err);
                else{ // we're all good
                    var newPath = global.appRoot + "/../../data/" + req.user.id + '/' + req.files.image.name;
                        fs.writeFile(newPath, data, function (err) {
                    });
                }
            });
            
        });
        this.image.files = req.files.image.name;
    }
    this.save(cb);
  },

   /**
   * Add iotlogs
   */
  addLog: function (iotlog,error, cb) {

    this.iotlogs.push({
        body: iotlog,
        error:error
    });
    this.save(cb);
  },
    
  /**
   * Add iotlogs
   *
   * @param {User} user
   * @param {Object} iotlog
   * @param {Function} cb
   * @api private
   */
  addIotlog: function (user, iotlog, error, cb) {
    var notify = require('../mailer');

    this.iotlogs.push({
      body: iotlog.body,
      error: error, 
      user: user._id
    });

    if (!this.user.email) this.user.email = 'info@pivotsecurity.com';
    notify.iotlog({
      Project: this,
      currentUser: user,
      iotlog: iotlog.body
    });

    this.save(cb);
  },

  /**
   * Remove iotlog
   *
   * @param {iotlogId} String
   * @param {Function} cb
   * @api private
   */
  removeIotlog: function (iotlogId, cb) {
    var index = utils.indexof(this.iotlogs, { id: iotlogId });
    if (~index) this.iotlogs.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  }
}

/** 
 * Statics
 */
ProjectSchema.statics = {

  /**
   * Find Project by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('iotlogs.user')
      .exec(cb);
  },

  /**
   * List Projects
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  list: function (options, cb) {
    var criteria = options.criteria || {"user" : options.user._id}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

   /**
   * Get a Project based on IOT credentials
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  findProject: function (options, cb) {
    var criteria = options.criteria || {"deviceid" : options.deviceid, "apikey" : options.apikey }
    console.info(criteria)
    
    this.findOne(criteria)
      .exec(cb);
  }
}

mongoose.model('Project', ProjectSchema);
