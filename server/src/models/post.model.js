const mongoose=require("mongoose");
const {Schema}=require("mongoose");


const postSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    thumbnail:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);

module.exports={
    Post
}