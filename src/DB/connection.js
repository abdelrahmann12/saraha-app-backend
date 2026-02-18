
import mongoose from "mongoose";

export function connectDB(){

    mongoose.connect("mongodb://localhost:27017/Saraha").then(()=>{
        console.log("dataBase connected successfuly")
    }).catch((error)=>{
        console.log(error);
    })
}


