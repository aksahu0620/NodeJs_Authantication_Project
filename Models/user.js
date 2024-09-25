import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    imgUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const User = mongoose.model("Authenticate", userSchema);