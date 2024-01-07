const config = {
    APP_NAME: "demo",
    role: {
        ADMIN: ["admin"],
        USER: ["user", "admin"]
    },
    JWT_SECRET: process.env.JWT_SECRET || "demo-secret",
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};

module.exports = config;
