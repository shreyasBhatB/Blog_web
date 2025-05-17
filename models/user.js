import mongoose,{Schema} from "mongoose";

const userSchema=new Schema({
    username:{type:String,required:true},
    password:{type:String,required:true}
}
)

const Users=mongoose.model('Users',userSchema)

export default Users;