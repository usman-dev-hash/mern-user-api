const path = require('path')
const multer = require('multer')
const UploadsHelper = require(path.join(__dirname, '../components/helpers/UploadsHelper'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profileImage") {
            cb(null, UploadsHelper.profileImagePath)
        }
        if (file.fieldname === "images") {
            cb(null, UploadsHelper.imagesPath)
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, Date.now() + ext) // file name
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" // Add support for jpeg files
        ) {
            callback(null, true)
        } else {
            console.log('Image file type not valid. File must be png or jpg!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 20
    }
})

module.exports = upload