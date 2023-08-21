const { Router, query } = require("express");
const PostModel = require("../models/post.model");


const postRouter = Router();

postRouter.get("/", async (req, res) => {
    const { userID, device1, device2 } = req.query;
    const query = {}
    if (userID) {
        query.userID = userID
    }
    if (device1 && device2) {
        query.device = { $and: [{ device: device1 }, { device: device2 }] }
    } else if (device1) {
        query.device = device1
    }
    try {
        const posts = await PostModel.find(query);
        res.status(200).send({
            msg: "User posts",
            posts
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }

})

postRouter.post("/add", async (req, res) => {
    const { userID } = req.body;
    try {
        const post = await PostModel({ ...req.body, userID })
        await post.save();
        res.status(200).send("Post added")
    } catch (error) {
        res.status(400).send({ error })
    }
})

postRouter.patch("/update/:postID", async (req, res) => {
    try {
        const { postID } = req.params;
        const { userID } = req.body;

        const post = await PostModel.findByIdAndUpdate({ userID, _id: postID }, req.body);
        if (post) {
            res.status(200).send({ msg: "Post Updated" })
        } else {
            res.status(400).send({ msg: "Post not found" })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})


postRouter.delete("/delete/:postID", async (req, res) => {
    try {
        const { postID } = req.params;
        const { userID } = req.body;

        const post = await PostModel.findByIdAndDelete({ userID, _id: postID });
        if (post) {
            res.status(200).send({ msg: "Post Deleted" })
        } else {
            res.status(400).send({ msg: "Post not found" })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = postRouter;