const dotenv=require("dotenv");
const mongoose=require("mongoose");
const {connectDB}=require("./db/connection.db.js")
const {app}=require("./app.js");

dotenv.config({
    path:"./.env"
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server started running at port: ${process.env.PORT}`);
    })

    app.on("error",(error)=>{
        console.log("ERR:",error);
        throw error;
    })
})
.catch((error)=>{
    console.log("MongoDB connection Failed !!!",error);
})