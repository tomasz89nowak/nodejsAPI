var multer  = require('multer');

var storage = multer.diskStorage({
  destination: 'public',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

var upload = multer({storage:storage});

module.exports = upload;