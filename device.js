import validator from "express-validator";

import error from "./error.js";
import { Device, Measurement } from "./models/models.js";

async function deviceLinking(request, response, next) {
    const deviceId = request.body.deviceId;
    const mac = request.body.macAddress;
    try {

        const check = await Device.findOne({ where: { id: deviceId }, raw: true });
        if (check === null) {
            next(new error.DataMeasureError({
                code: 404,
                message: "Device was not found",
                param: {
                    name: "deviceId",
                },
            }));
            return;
        }

        const measure = await Measurement.findOne({ where: { id: check.measurement_id }, raw: true });

        if (measure.is_finished) {
            next(new error.DataMeasureError({
                code: 405,
                message: "Measurement is finished",
                param: {
                    name: "deviceId",
                },
            }));
            return;
        }
        if (check.mac_address !== null && check.mac_address !== mac) {
            next(new error.DataMeasureError({
                code: 409,
                message: "Device is already linked",
                param: [
                    {
                        name: "deviceId",
                    },
                    {
                        name: "macAddress",
                    },
                ],
            }));
            return;
        }
        const reg = /([\dA-Fa-f]{2}[:-]){5}([\dA-Fa-f]{2})/;
        if (!mac?.match(reg)) {
            next(new error.DataMeasureError({
                code: 400,
                message: "Incorrect MAC-address",
                param: [
                    {
                        name: "macAddress",
                    },
                ],
            }));
            return;
        }

        await Device.update({ id: deviceId, mac_address: mac, measurement_id: check.measurement_id }, { where: { id: deviceId } });
        response.json({
            id: deviceId,
            name: check.name,
            macAddress: mac,
            measurementId: check.measurement_id,
        });
    } catch (err) {
        next(err);
    }

}

async function deviceUnlinking(request, response, next) {
    const deviceId = request.body.deviceId;
    const mac = request.body.macAddress;
    try {

        const check = await Device.findOne({ where: { id: deviceId }, raw: true });
        if (check === null) {
            next(new error.DataMeasureError({
                code: 404,
                message: "Device was not found",
                param: {
                    name: "deviceId",
                },
            }));
            return;
        }
        if (check.mac_address !== mac && check.mac_address !== null) {
            next(new error.DataMeasureError({
                code: 403,
                message: "MAC is not linked",
                param: {
                    name: "macAddress",
                },
            }));
            return;
        }

        await Device.update({ mac_address: null }, { where: { id: deviceId } });
        response.json({
            id: deviceId,
            name: check.name,
            macAddress: null,
            measurementId: check.measurement_id,
        });
    } catch (err) {
        next(err);
    }
}

export default {
    linking: [
        validator.body("deviceId").exists().isString().notEmpty(),
        validator.body("macAddress").exists().isString().notEmpty(),
        deviceLinking,
    ],
    unlinking: [
        validator.body("deviceId").exists().isString().notEmpty(),
        validator.body("macAddress").exists().isString().notEmpty(),
        deviceUnlinking,
    ],
};