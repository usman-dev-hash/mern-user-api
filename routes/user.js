const express = require('express')
const router = express.Router()
const path = require('path')

// getting UserController with it's methods/operations
const UserController = require(path.join(__dirname, '../controllers/UserController'))

// importing middleware for images uploads
const uploads = require(path.join(__dirname, '../middlewares/uploads'))

const imageUploading = uploads.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'images', maxCount: 6 },
])

// here are all operations/methods of UserController
router.get('/', UserController.index)
router.post('/show', UserController.show)
router.post('/store', imageUploading, UserController.store)
router.post('/update', imageUploading, UserController.update)
router.post('/destroy', UserController.destroy)
router.post('/login', UserController.login)


module.exports = router