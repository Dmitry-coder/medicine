import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import AdminJS from "adminjs";
import express from "express";

import * as models from "./models/models.js";

function run(port, route) {
    AdminJS.registerAdapter(AdminJSSequelize);
    const adminJs = new AdminJS({
        resources: Object.values(models),
        rootPath: route,
    });
    const app = express();
    const router = AdminJSExpress.buildRouter(adminJs);
    app.use(adminJs.options.rootPath, router);
    app.listen(port, () => console.log(`AdminJS started listening on ${port} (${route})`));
}

export default {
    run,
};