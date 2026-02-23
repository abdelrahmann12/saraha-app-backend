
import mongoose from "mongoose";

export function connectDB(){

    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("dataBase connected successfuly")
    }).catch((error)=>{
        console.log(error);
    })
}

 
