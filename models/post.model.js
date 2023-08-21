const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: String,
    body: String,
    device: String
})

const PostModel = mongoose.model("InstaPosts", postSchema);

module.exports = PostModel;