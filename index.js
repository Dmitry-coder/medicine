import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import httpsLocalhost from "https-localhost";
import morgan from "morgan";

import "./config.js";
import admin from "./admin.js";
import auth from "./auth.js";
import device from "./device.js";
import doctor from "./doctor.js";
import error from "./error.js";
import measurement from "./measurement.js";

const port = process.env.PORT || 443;
const adminPort = process.env.ADMIN_PORT || 80;

const app = httpsLocalhost();
const apiRouter = express.Router();

const corsOptions = {
    methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    credentials: true,
    origin: /https?:\/\/localhost:(8080|3000)/,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use(morgan("dev"));

app.use("/api", apiRouter);

apiRouter.post("/auth", auth.authenticate);
apiRouter.get("/doctor/:id", auth.authGuard, doctor.info);
apiRouter.post("/measurement", auth.authGuard, measurement.create);
apiRouter.get("/measurement/:id", auth.authGuard, measurement.info);
apiRouter.get("/measurement/:id/data/:param", auth.authGuard, measurement.view);
apiRouter.get("/measurement/:id/data/live/:param", auth.authGuard, measurement.viewLive);
apiRouter.put("/measurement/data", measurement.pushData);
apiRouter.patch("/measurement/stop", auth.authGuard, measurement.stop);
apiRouter.post("/device/unlinking", device.unlinking);
apiRouter.post("/device/linking", device.linking);

app.use(error.handleError);

app.listen(port, () => console.log(`server started listening on ${port}`));

if (process.env.NODE_ENV === "production") {
    admin.run(adminPort, "/admin");
}
