
/**
 * Expose
 */

module.exports = {
  variants: {
    project: {
    },

    gallery: {
    }
  },
  storage: {
    S3: {
      key: process.env.IMAGER_S3_KEY,
      secret: process.env.IMAGER_S3_SECRET,
      bucket: process.env.IMAGER_S3_BUCKET
    },
    Local:{
        path: "/tmp/"
    }
  },

  debug: true
}
