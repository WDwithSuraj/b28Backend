const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./config/db")
const auth = require("./middlewares/auth.middleware");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route")

app.use(express.json());
app.use(cors())
require("dotenv").config();

// app.use("/", (req, res) => {
//     res.send("Welcome to the backend systum of Insta")
// })
app.use("/users", userRoute);
app.use("/posts", auth, postRoute)

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("DB Connected");
        console.log("Server is running")
    } catch (error) {

    }
})