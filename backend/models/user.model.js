import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        mobile: { type: String, required: true, trim: true },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        profileImageUrl: { type: String, default: "" },
        location: { type: String, trim: true, default: "" },
    },
    { timestamps: true },
);

export default mongoose.model("User", userSchema);
