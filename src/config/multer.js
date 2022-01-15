const multer = require('multer');
const fs = require('fs-extra');

module.exports = {
    uploadAvatar:
        multer({
            storage: multer.diskStorage({
                destination: (req, file, callback) => {
                    console.log(req.body.url);
                    const path = `src/public${req.body.url}`;
                    fs.ensureDirSync(path);
                    callback(null, path);
                },
                filename: (req, file, cb) => {
                    cb(null , `${file.originalname}`);
                }
            })
        })  
}