const { Router } = require("express");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklist.model");
const userRouter = Router();
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            res.status(200).send({ msg: "User already registered" })
        } else {
            const hashedPass = bcrypt.hashSync(req.body.password, 10);
            const newUser = await UserModel({
                ...req.body,
                password: hashedPass
            })
            await newUser.save();
            res.status(200).send({ msg: "User registered sucsessfull" })
        }
    } catch (error) {
        res.send(400).status({ error: error.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY);
                    res.status(200).send({ msg: "User Logged in", token })
                } else {
                    res.status(200).send("Password incorrect")
                }
            })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})



userRouter.post("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            await BlacklistModel.updateMany({}, { $push: { blacklist: [token] } });
            res.status(200).send("Logout sucsessfull")
        }
    } catch (error) {
        res.status(200).send({ error: error.message })
    }
})
module.exports = userRouter;