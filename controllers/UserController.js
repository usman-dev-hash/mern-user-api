const path = require('path')
const fs = require('fs')
const User = require(path.join(__dirname, '../models/User'))
const UploadsHelper = require(path.join(__dirname, '../components/helpers/UploadsHelper'))
const bcrypt = require('bcrypt')


const index = (req, res, next) => {
    User.find()
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            res.json({
                message: 'Error occur while fetching the users'
            })
        })
}

const show = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId)
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            res.json({
                message: `Error occur while fetching the user (${userId})`
            })
        })
}

const store = async (req, res, next) => {

    const storeUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
    })

    const uploadedFiles = req.files;
    storeUser.profileImage = UploadsHelper.getImagesToStore(uploadedFiles.profileImage)
    storeUser.images = UploadsHelper.getImagesToStore(uploadedFiles.images, false)

    storeUser.save()
        .then(response => {
            res.json({
                message: 'User store successfully!'
            })
        })
        .catch(error => {
            res.json({
                message: `Error occur while storing the user`
            })
        })
}

const update = async (req, res, next) => {

    const userId = req.body.userId;

    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
    }

    console.log(req.body)

    const uploadedFiles = req.files;

    // Check if new images are uploaded
    if (uploadedFiles) {

        // Delete previous images from storage
        const user = await User.findById(userId);
        console.log(user)
        if (user) {

            // check if `profileImage` exist in updated data or not
            if (uploadedFiles.profileImage && uploadedFiles.profileImage.length > 0) {
                console.log(`user.profileImage --> ${user.profileImage}`)
                if (user.profileImage) {
                    const filePath = UploadsHelper.profileImagePath + user.profileImage;
                    const checkFileExistence = UploadsHelper.checkFileExistence(filePath);
                    console.log(`profileImage file exists & unlinking the file (${user.profileImage})`)
                    UploadsHelper.unlinkFile(checkFileExistence, filePath)
                }
                // here we storing `profileImage` in directory & DB
                Object.assign(updatedData, {
                    // it's giving us - "19631654231.jpg"
                    profileImage: UploadsHelper.getImagesToStore(uploadedFiles.profileImage)
                })
            }

            // check if `images` exist in updated data or not
            if (uploadedFiles.images && uploadedFiles.images.length > 0) {
                console.log(`user.images --> ${user.images}`)
                if (user.images) {
                    const previousImages = JSON.parse(user.images);
                    previousImages.forEach((imagePath) => {

                        const filePath = UploadsHelper.imagesPath + imagePath;
                        const checkFileExistence = UploadsHelper.checkFileExistence(filePath);
                        console.log(`image file exists & unlinking the file (${imagePath})`)
                        UploadsHelper.unlinkFile(checkFileExistence, filePath)
                    })
                }

                // here we storing `images` in directory & DB
                Object.assign(updatedData, {
                    // it's giving us '["1690667004426.jpg","1690667004428.jpg","1690667004432.png"]'
                    images: UploadsHelper.getImagesToStore(uploadedFiles.images, false)
                })
            }
        }
    }

    console.log("After UpdatedData array prepared ===> ", updatedData)

    User.findByIdAndUpdate(userId, {$set: updatedData})
        .then(response => {
            res.send('User updated successfully!')
        })
        .catch(error => {
            res.send(`Error occur while updated the user (${userId})`)
        })
}

const destroy = async (req, res, next) => {

    const userId = req.body.userId;

    // Delete previous images from storage
    const user = await User.findById(userId);

    if (user) {

        // check if `profileImage` exist in updated data or not
        if (user.profileImage) {
            const filePath = UploadsHelper.profileImagePath + user.profileImage;
            const checkFileExistence = UploadsHelper.checkFileExistence(filePath);
            console.log(`profileImage file exists & unlinking the file (${user.profileImage})`)
            UploadsHelper.unlinkFile(checkFileExistence, filePath)
        }

        // check if `images` exist in updated data or not
        if (user.images) {
            const previousImages = JSON.parse(user.images);
            previousImages.forEach((imagePath) => {

                const filePath = UploadsHelper.imagesPath + imagePath;
                const checkFileExistence = UploadsHelper.checkFileExistence(filePath);
                console.log(`image file exists & unlinking the file (${imagePath})`)
                UploadsHelper.unlinkFile(checkFileExistence, filePath)
            })
        }
    }

    User.findByIdAndRemove(userId)
        .then(response => {

            res.json({
                message: 'User deleted successfully!'
            })
        })
        .catch(error => {
            res.json({
                message: `Error occur while deleted the user (${userId})`
            })
        })
}

const login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    // Handle the error
                    console.log(err);
                    res.json({
                        message: err
                    })
                } else if (result) {
                    // Passwords match, user can be authenticated
                    console.log('Authentication successful');
                    res.json({
                        data: user
                    })
                } else {
                    // Passwords do not match, user authentication failed
                    console.log('Authentication failed');
                    res.json({
                        message: 'Authentication failed'
                    })
                }
            });

        })
        .catch(error => {
            res.json({
                message: error
            })
        })
}


module.exports = {index, show, store, update, destroy, login}