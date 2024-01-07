const ms = require("ms");
const router = require("express").Router();

const User = require("../models/user.model");
const response = require("../utils/response");
const { role, APP_NAME } = require("../config");
const CustomError = require("../utils/custom-error");
const { redisClient } = require("../libraries/redis");
const auth = require("../middlewares/auth.middleware");

router.get("/me", auth(role.USER), async (req, res) => {
    // Get User Info from Redis Cache
    if (redisClient.isReady) {
        const cachedProfile = await redisClient.get(`${APP_NAME}:user:${req.$user._id}`);
        if (cachedProfile) {
            res.status(200).json(response("User found", { user: JSON.parse(cachedProfile) }, true));
        }
    }

    // Get user
    const user = await User.findById(req.$user._id);
    if (!user) throw new CustomError("unauthorized access: User does not exist", 401);

    // Sleep for 10 seconds to simulate a slow database
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Cache user info
    if (redisClient.isReady) {
        redisClient.set(`${APP_NAME}:user:${user._id}`, JSON.stringify(user), { EX: ms("4h") / 1000 })
    }

    // Send response
    res.status(200).json(response("User found", { user }, true));
});

module.exports = router;
