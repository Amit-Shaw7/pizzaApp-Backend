import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    photo: String,
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;