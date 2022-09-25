import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
        unique : true
    },
    photoUrl : {
        type : String,
        default : "nourl"
    },
    price :{
        type: Number,
        required : true,
    }
},{timestamps:true});

const ProductModel = mongoose.model("Product" , ProductSchema);
export default ProductModel;