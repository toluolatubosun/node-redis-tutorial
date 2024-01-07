require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { connectRedis } = require("./libraries/redis");

const app = express();

mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(process.env.PORT))
    .then((result) => console.log(`Server is listening for requests @ localhost:${process.env.PORT}`))
    .catch((error) => console.log(error));

connectRedis();

// Middleware
app.use(
    cors({
        origin: "*"
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// Route Middleware
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/user", require("./routes/user.route"));

// Error Handling Middleware
require("./middlewares/error.middleware")(app);
