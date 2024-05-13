const {Router}=require("express");
const {upload}=require("../middlewares/multer.middleware.js");
const { signUpUser, createPost } = require("../controllers/userController.controller.js");
const { verifyUserJwt } = require("../middlewares/userAuth.middleware.js");
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

router.route("/createPost").post(
    verifyUserJwt,
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    createPost
)
module.exports=router;