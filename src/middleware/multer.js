const multer = require('multer');

// const storage = multer.diskStorage({
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = {
    upload
}