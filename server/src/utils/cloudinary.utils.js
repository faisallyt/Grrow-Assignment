const cloudinary = require('cloudinary').v2
const fs =require("fs");

cloudinary.config({ 
    cloud_name:"dk70uffvg", 
    api_key:169718243936957 , 
    api_secret:"lDE2tYpxAJJnb8bcHYAurWHSgKE"
  });

const uploadOnCloudinary=async(localFilePath)=>{
    // console.log(localFilePath)
    try{
        
        if(!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        console.log("hello");
        
        //after upload remove it from server
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);

        return null;
    }
}

module.exports={
    uploadOnCloudinary
}