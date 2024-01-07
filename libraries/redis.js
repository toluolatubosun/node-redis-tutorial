const ms = require("ms");
const { createClient } = require("redis")

const { REDIS_URL } = require("../config");

const redisClient = createClient({
    url: REDIS_URL,
    pingInterval: ms("12h"),
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.log("Too many retries on REDIS. Connection Terminated");
                return new Error("Too many retries.");
            } else {
                return retries;
            }
        }
    }
});

redisClient.on("connect", () => console.log(":::> Connected to Redis database"));
redisClient.on("error", (err) => console.error(":::> Redis connection error", err));

const connectRedis = async () => redisClient.connect();

module.exports = { redisClient, connectRedis };
