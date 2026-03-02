import  { get, model, Schema } from "mongoose";


const userSehma = new Schema({
    firstName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    email:{
        type:String,
        trim:true,
        unique:function(){
            this.phoneNumber  ? false : true
        },
        sparse:true
    },
    phoneNumber:{
        type:String,
        trim:true,
        unique:function(){
            this.email ? false :true
        },
       sparse:true

    },
    password:{
        type:String,
        trim:true,
        required:true,
        select: false
    },
    dob:{
        type:Date,
        required:true
    },
    otp:{
        type:Number
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    isExpired:{
        type:Date
    },
    profilePic:{
        secure_url:String,
        public_id:String,
    },
    credentialUpdatedAt:{
        type:Date,
        default:Date.now(),
    }
},{timestamps:true})

const User = model("user" , userSehma)


userSehma.virtual("fullName").get(function(){
    return `${firstName} ${lastName}` ;
})
userSehma.virtual("age").get(function(){
    return new Date().getFullYear() - new Date(this.dob).getFullYear() ;
})

userSehma.virtual("fullName").set(function(name){
     const [firstName , lastName] = name.split(" ") ;
     this.firstName = firstName ;
     this.lastName = lastName;
})


export {User} ;