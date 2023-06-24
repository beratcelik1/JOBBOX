const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), expires: 604800}, // token expires in 1 Hour
});

module.exports = mongoose.model("token", tokenSchema);