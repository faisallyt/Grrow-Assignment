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
const sendEmail = require("../utils/sendEmail.utils.js");

const signUpUser=asyncHandler(async(req,res)=>{
    
    const {name,email,username,password}=req.body;

    //checking if required fields are provided
    if([email,username,password].some(field=>!field || field.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }

    //check if student with same email or username already exists or not

    // console.log("hello")
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
    
    const messageToMail=`hello ${name?name:username} . You are welcomed on This Website `
    
    // await sendEmail(createdUser.email,"Welcome Message ",message);
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

const getAllPosts = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to 1
    const limit = 3; // Number of posts per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const posts = await Post.find().skip(startIndex).limit(limit);

    if (posts.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { posts: [], page: page, totalPages: 0 }, // Return an empty array of posts and set totalPages to 0
                "There are no posts",
            )
        );
    }

    // console.log(posts);
    
    const totalPosts = await Post.countDocuments(); // Count total number of posts in database
    const totalPages = Math.ceil(totalPosts / limit); // Calculate total pages

    return res.status(200).json(
            { posts: posts}
    );
});



const loginUser=asyncHandler(async(req,res)=>{
    if(req.cookies?.accessToken || req.header.Authorization){
        throw new ApiError(400,"User is already logged in");
    }
    const {email,username,password}=req.body;

    if(!username && !email){
        throw new ApiError(400,"username or email is required");
    }

    const user=await User.findOne({
        $or:[{email},{username}]
    });

    if(!user){
        throw new ApiError(404,"User does not exists");
    }

    
    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,
                refreshToken
            },
            "User logged in Successfully"
        )
    )
});

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(
        200,
        {},
        "User logged Out"
    ))
});

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken ;

    if(req.cookies.accessToken || req.header.Authorization){
        throw new ApiError(400,"User is already logged in")
    }
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request");
    }

    try{
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

        const user=await User.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(401,"invalid refresh Token");
        }

        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used");
        }

        const options={
            httpOnly:true,
            secure:true,
        }

        const {accessToken,refreshToken:newRefreshToken}=await generateAccessAndRefreshTokens(user._id);
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
    }
    catch(error){
        throw new ApiError(401,error?.message || "Invalid refresh Token");
    }
});

const resetPassword=asyncHandler(async(req,res)=>{
    try{
        const userId=req.user._id;
        const {oldPassword,newPassword}=req.body;
    
        if(oldPassword===newPassword){
            throw new ApiError(400,"New Password and Old password can not be same");
        }

        const user=await User.findById({_id:userId});
    
        if(!user){
            throw new ApiError(404,"User doesn't exists");
        }
    
        const isPasswordValid=await user.isPasswordCorrect(oldPassword);
    
        if(!isPasswordValid){
            throw new ApiError(400,"Old password you entered is incorrect");
        }
        user.password=newPassword;
        await user.save();
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Password changed successfully"
            )
        )
    }
    catch(error){
        throw new ApiError(500,error?.message || "Something went wrong while changing password");
    }
})

module.exports={
    signUpUser,
    createPost,
    getAllPosts,
    loginUser,
    logoutUser,
    refreshAccessToken,
    resetPassword
}