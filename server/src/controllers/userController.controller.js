const {asyncHandler}=require("../utils/asyncHandler.utils.js");
const {ApiError}=require("../utils/ApiError.utils.js");
const {ApiResponse}=require("../utils/ApiResponse.utils.js");
const {User} =require("../models/user.model.js");
const {uploadOnCloudinary}=require("../utils/cloudinary.utils.js");
const {generateAccessAndRefreshTokens}=require("../utils/GenerateAccessTokenAndRefreshToken.utils.js");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const { Post } = require("../models/post.model.js");

const signUpUser=asyncHandler(async(req,res)=>{
    
    const {name,email,username,password}=req.body;

    //checking if required fields are provided
    if([email,username,password].some(field=>!field || field.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }

    //check if student with same email or username already exists or not
    const existedUser=await User.findOne({$or:[{username},{email}]});

    if(existedUser){
        throw new ApiError(409,"User with this email or username already exists");
    }

    //saving profile picture to cloduinary
    const profileLocalPath = req.files && req.files.profile && req.files.profile.length > 0 ? req.files.profile[0].path : null;

    let profile=null;
    if(profileLocalPath){
        profile=await uploadOnCloudinary(profileLocalPath);
        if(!profile){
            throw new ApiError(400,"Profile picture upload failed");
        }
    }


    const user=await User.create({
        name,
        profile:profile?.url,
        email,
        password,
        username:username.toLowerCase()
    })

    //find created user

    const createdUser=await User.findOne(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500,"failed to retreive created student ");
    }

    //generate access and refreshTokens

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

    //Add AccessToken and RefreshToken to createdStudent

    
    createdUser.refreshToken=refreshToken;
    await createdUser.save();

    createdUser.accessToken=accessToken;


    // Set cookie options
    const options = {
        httpOnly: true,
        secure: true
    };
    // Send response with cookies

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, createdUser, "user registered successfully"));

})


//creating a post 

const createPost=asyncHandler(async(req,res)=>{
    const {title,description}=req.body;

    if(!title || !description){
        throw new ApiError(400,"title and description is needed");
    }

    if(!req.files || !req.files.thumbnail || !req.files.thumbnail[0] || !req.files.thumbnail[0].path){
        throw new ApiError(400,"thumbnail is required");
    }


    const thumbnailLocalPath=req.files.thumbnail[0].path;
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail){
        throw new ApiError(400,"thumbanil upload failed");
    }

    const post=await Post.create({
        title,
        description,
        thumbnail:thumbnail.url
    })


    return res
    .status(200)
    .json(new ApiResponse(
        200,post,"Post Created Successfully"
    ))
    
})


module.exports={
    signUpUser,
    createPost
}