
import { Schema } from "mongoose";


const messageSchema = new Schema({
    reciver:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        minLength:3,
        maxLength:1000,
        required:true
    },
    attachments:[{secure_url:String , public_id:String}]
})