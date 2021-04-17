
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../archivos/'+req.body.selectCategoria));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname.split('.')[0] +'.'+file.mimetype.split('/')[1]);
    }
})

const uploader = multer({storage});

module.exports = uploader;