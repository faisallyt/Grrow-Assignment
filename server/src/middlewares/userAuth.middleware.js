const {ApiError}=require("../utils/ApiError.utils.js");
const {asyncHandler}=require("../utils/asyncHandler.utils.js");
const jwt =require("jsonwebtoken");
const {User}=require("../models/user.model.js");


const verifyUserJwt=asyncHandler(async(req, _,next)=>{
   try{
     //getting jwt token from either cookies or Header
      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
      if(!token){
        throw new ApiError(401,"Unauthorized request");
      }

      const decodedToken =await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

      const user=await User.findById(decodedToken?._id).select("-password -refreshToken");

      if(!user){
        throw new ApiError(401,"Invalid Access Token");
      }

      req.user=user;

      next();

   }
   catch(error){
       throw new ApiError(401,error?.message || "Invalid access Token");
   }
})

module.exports={
    verifyUserJwt
}