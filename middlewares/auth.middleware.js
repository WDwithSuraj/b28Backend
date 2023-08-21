const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistModel = require("../models/blacklist.model");
require("dotenv").config();


const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {

        if (token) {
            const exitingToken = await BlacklistModel.find({ blacklist: { $in: token } })

            if (exitingToken.length > 0) {
                res.status(400).send({ msg: "Please Login again!" })
            } else {
                let decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.body.userID = decoded.userID
                next();
            }

        } else {
            res.send(400).send("First Register yourself")
        }
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

module.exports = auth