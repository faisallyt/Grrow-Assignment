const {ApiError}=require("../utils/ApiError.utils.js");
const {asyncHandler}=require("../utils/asyncHandler.utils.js");
const jwt =require("jsonwebtoken");
const {User}=require("../models/user.model.js");


const verifyUserJwt=asyncHandler(async(req, _,next)=>{
   try{
      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
      if(!token){
        throw new ApiError(401,"Unauthorized request");
      }

      const decodedToken =await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      
   }
   catch(error){

   }
})