import { SequelizeAuto } from "sequelize-auto";

import { sequelize } from "./db.js";

const sequelizeAuto = new SequelizeAuto(sequelize, undefined, undefined, {
    dialect: "postgres",
    directory: "./models",
    port: 5432,
    singularize: false,
    useDefine: true,
    lang: "esm",
    caseModel: "c",
    caseProp: "c",
    caseFile: "k",
});

sequelizeAuto.run()
    .then(() => console.log("Models generated successfully!"))
    .catch(error => console.error(error));