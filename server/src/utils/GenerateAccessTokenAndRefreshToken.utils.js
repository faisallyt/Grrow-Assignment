const {User}=require("../models/user.model.js");
const {ApiError}=require("./ApiError.utils.js");


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user=await User.findById(userId);
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

module.exports = {
    generateAccessAndRefreshTokens
};