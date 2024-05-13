const mongoose=require("mongoose");
const {Schema}=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const crypto=require("crypto");

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        lowerCase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        index:true
    },
    name:{
        type:String,
        trim:true,
        index:true
    },
    profile:{
        type:String, //cloudinary url
    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    refreshToken:{
        type:String
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:String
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        name:this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

userSchema.methods.getResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;
}

const User=mongoose.model("User",userSchema);
module.exports={User};