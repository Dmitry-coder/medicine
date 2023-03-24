import bcrypt from "bcryptjs";
import validator from "express-validator";
import StatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import error from "./error.js";
import { Doctor } from "./models/models.js";

async function authenticate(request, response, next) {
    const login = request.body.login;
    const password = request.body.password;
    try {
        const doctor = await Doctor.findOne({ where: { login: login }, raw: true });
        if (doctor === null) {
            next(new error.AuthError({
                code: StatusCodes.UNAUTHORIZED,
                message: "Doctor with such login does not exist",
                param: {
                    name: "login",
                },
            }));

            return;
        }
        bcrypt.compare(password, doctor.password, function (err, result) {
            if (err) {
                return response.status(401).json({
                    failed: "Unauthorized Access",
                });
            }

            if (result) {
                response.json({
                    token: jwt.sign({
                            login: login,
                            id: doctor.id,
                        },
                        "secret", {
                            expiresIn: "24h",
                        }, null,
                    ),
                });
            } else {
                next(new error.AuthError({
                    code: 403,
                    message: "Wrong doctor password",
                    param: {
                        name: "password",
                    },
                }));

            }
        });
    } catch (err) {
        next(err);
    }
}

function tokenVerify(request, response, next) {
    let token = request.headers.authorization;
    let ch = true;
    if (token === undefined) {
        ch = false;
        console.log(token);
    } else {
        token = token.split(" ")[1];
        let ver = jwt.verify(token, "secret", { expiresIn: "24h" }, function (err, decode) {
            if (err) {
                ch = false;
            } else {
                let id = decode.id;
                let login = decode.login;
                try {
                    const ver = Doctor.findOne({ where: { id: id, login: login }, raw: true });
                    if (ver === null) {
                        ch = false;
                    }
                } catch (err) {
                    next(err);
                }
            }

        });
    }
    if (!ch) {
        next(new error.MeasurementError({
            code: 401,
            message: "Unauthorized",
        }));
        return;
    }
    next();
}

export default {
    authenticate: [
        validator.body("login").exists().isString().notEmpty(),
        validator.body("password").exists().isString().notEmpty(),
        authenticate,
    ],
    authGuard: [
        validator.header("authorization").exists().isString().notEmpty(),
        tokenVerify,
    ],
};