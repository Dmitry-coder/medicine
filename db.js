import { Sequelize } from "sequelize";

import "./config.js";

export const sequelize = new Sequelize(process.env.DB_CONNECTION_URL, {
    dialectOptions: { ssl: { rejectUnauthorized: false } },
    logging: process.env.NODE_ENV === "production" ? false : process.env.NODE_ENV === "true" && console.log,
});

try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}