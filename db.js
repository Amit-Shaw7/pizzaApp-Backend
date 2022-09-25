import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const { connection } = mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to DB")
    } catch (error) {
        console.log(error.message)
    }
}