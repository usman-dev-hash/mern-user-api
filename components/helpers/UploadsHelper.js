// const fs = require('fs').promises;
const fs = require('fs');

const getImagesToStore = (fileObject, singleImage = true) => {

    // Check if fileObject is set and not null or undefined
    if (typeof fileObject === 'undefined' || fileObject === null) {
        return null;
    }

    if (singleImage) {
        let filesPath = ''
        fileObject.forEach((files, index, arr) => {
            /* EXAMPLE -
            {
                fieldname: 'profileImage',
                originalname: 'IMG-20170912-WA0000.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                destination: 'public/images/uploads/profiles/',
                filename: '1690658710202.jpg',
                path: 'public\\images\\uploads\\profiles\\1690658710202.jpg',
                size: 44003
            }*/
            filesPath = filesPath + files.filename + '|'
        })
        return filesPath.substring(0, filesPath.lastIndexOf('|'))
    } else {
        const multipleImagesArray = []
        fileObject.forEach((files, index, arr) => {
            multipleImagesArray.push(files.filename);
        })
        return JSON.stringify(multipleImagesArray)
    }
}

const profileImagePath = "public/images/uploads/profiles/"
const imagesPath = "public/images/uploads/"

const checkFileExistence = (filePath) => {
    try {
        //await fs.access(filePath);
        if (fs.existsSync(filePath)) {
            console.log('File exists!');
            return true;
        } else {
            console.log('File not exists!');
            return false;
        }
        // fs.existsSync(filePath)  --> we can check file existence as well
    } catch (error) {
        console.log(error);
        //console.log('File not exists!');
        return false;
    }
}

const unlinkFile = (checkFileExistence, filePath) => {
    if (typeof checkFileExistence !== 'undefined' && checkFileExistence) {
        fs.unlinkSync(filePath); // Delete the previous profile image
    }
}

module.exports = { getImagesToStore, profileImagePath, imagesPath, checkFileExistence, unlinkFile }