const express=require("express");
const cors=require("cors");

const cookieParser=require("cookie-parser");

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"));
app.use(cookieParser());

//routes import 
const userRouter=require("./routes/userRoute.route.js");

app.use("/api/v1/user",userRouter);


module.exports={
    app
}