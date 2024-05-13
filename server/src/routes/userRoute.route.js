const {Router}=require("express");
const {upload}=require("../middlewares/multer.middleware.js");
const { signUpUser, createPost,getAllPosts, loginUser, logoutUser, refreshAccessToken, resetPassword } = require("../controllers/userController.controller.js");
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

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken);




//protected routes

router.route("/createPost").post(verifyUserJwt,
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    createPost
)
router.route("/posts").get(verifyUserJwt,getAllPosts)
router.route("/logout").post(verifyUserJwt,logoutUser);
router.route("/resetPassword").post(verifyUserJwt,resetPassword);


module.exports=router;