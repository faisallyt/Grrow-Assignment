const {Router}=require("express");
const {upload}=require("../middlewares/multer.middleware.js");
const { signUpUser } = require("../controllers/userController.controller.js");
const router=Router();

router.route("/signup").post(
    upload.fields([
        {
            name:"profile",
            maxCount:1
        }
    ]),
    signUpUser
)

module.exports=router;