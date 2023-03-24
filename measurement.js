import validator from "express-validator";
import _ from "lodash";
import { cast, col, Op, where } from "sequelize";
import error from "./error.js";

import { Device, Measurement, MeasurementParameterData, MeasurementParameterDataFragment, Patient } from "./models/models.js";
import sse from "./sse.js";

function compareTimestamp(a, b) {
    if (a.timestamp > b.timestamp) return 1;
    if (a.timestamp === b.timestamp) return 0;
    if (a.timestamp < b.timestamp) return -1;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function measurementCreate(request, response, next) {
    const id = request.body.deviceId;
    const patient = request.body.patientId;
    try {

        const check = await Device.findOne({ where: { id: id }, raw: true });
        if (!check) {
            next(new error.MeasurementError({
                code: 404,
                message: "Device was not found",
                param: {
                    name: "deviceId",
                },
            }));
            return;
        }

        const patientCheck = await Patient.findOne({ where: { id: patient }, raw: true });
        if (patientCheck === null) {
            next(new error.MeasurementError({
                code: 404,
                message: "Patient was not found",
                param: {
                    name: "patientId",
                },
            }));
            return;
        }
        if (check.measurement_id === null) {
            let date = Date.now();

            await Measurement.create({
                id: id + "_" + date, start_timestamp: new Date(date),
                patient_id: patient, device_id: id, is_finished: false,
            });

            const getting2 = await Measurement.findOne({ where: { id: id + "_" + date }, raw: true });

            await Device.update({ measurement_id: id + "_" + date }, { where: { id: id } });
            response.json({
                id: getting2.id,
                startTimestamp: getting2.start_timestamp.valueOf(),
                patientId: getting2.patient_id,
                deviceId: getting2.device_id,
                isFinished: getting2.is_finished,
            });
        } else {
            next(new error.MeasurementError({
                code: 409,
                message: "Device is busy",
                param: {
                    name: "deviceId",
                },
            }));
        }
    } catch (err) {
        next(err);
    }
}

async function measurementInfo(request, response, next) {
    const id = request.params.id;
    try {

        const check = await Measurement.findOne({ where: { id: id }, raw: true });
        if (check === null) {
            next(new error.ViewError({
                code: 404,
                message: "Measurement was not found",
                param: {
                    name: "measurementId",
                },
            }));
        } else {

            const getData = await MeasurementParameterData.findAll({ where: { measurement_id: id }, raw: true });
            const measurementParamsNames = getData.map(param => param.name);
            response.json({
                id: id,
                startTimestamp: check.start_timestamp.valueOf(),
                patientId: check.patient_id,
                deviceId: check.device_id,
                isFinished: check.is_finished,
                params: measurementParamsNames,
            });

        }

    } catch (err) {
        next(err);
    }
}

async function measurementView(request, response, next) {
    const id = request.params.id;
    const param = request.params.param;
    try {
        const check = await Measurement.findOne({ where: { id: id }, raw: true });
        if (check === null) {
            next(new error.ViewError({
                code: 404,
                message: "Measurement was not found",
                param: {
                    name: "measurementId",
                },
            }));
            return;
        }
        const check2 = await MeasurementParameterData.findOne({ where: { measurement_id: id, name: param }, raw: true });
        if (check2 === null) {
            next(new error.ViewError({
                code: 404,
                message: "Param was not found",
                param: [
                    {
                        name: "measurementId",
                    },
                    {
                        name: "param",
                    },
                ],
            }));
        }
        const getData = await MeasurementParameterDataFragment.findAll({
            where: {
                measurement_id: id,
                measurement_parameter_name: param,
            }, raw: true,
        });
        let buffer = getData.reverse()
            .sort(compareTimestamp)
            .map(value => {
                return {
                    timestamp: value.timestamp.valueOf(),
                    data: value.data,
                };
            });
        response.json({
            id: id,
            startTimestamp: check.start_timestamp.valueOf(),
            patientId: check.patient_id,
            deviceId: check.device_id,
            isFinished: check.is_finished,
            paramName: check2.name,
            dataType: check2.type,
            data: buffer,
        });
    } catch (err) {
        next(err);
    }
}

async function measurementViewLive(request, response, next) {
    const id = request.params.id;
    const param = request.params.param;
    try {

        let check = await Measurement.findOne({ where: { id: id }, raw: true });
        if (check === null) {
            next(new error.AliveViewError({
                code: 404,
                message: "Measurement was not found",
                param: {
                    name: "measurementId",
                },
            }));
            return;
        }

        let check2 = await MeasurementParameterData.findOne({ where: { measurement_id: id, name: param }, raw: true });
        if (check2 === null) {
            next(new error.AliveViewError({
                code: 404,
                message: "Param was not found",
                param: [
                    {
                        name: "measurementId",
                    },
                    {
                        name: "param",
                    },
                ],
            }));
            return;
        }

        let getData = await MeasurementParameterDataFragment.findAll({
            where: {
                measurement_id: id,
                measurement_parameter_name: param,
            }, raw: true,
        });
        let buffer = getData;
        let maxTime = new Date(0);
        if (buffer !== []) {
            buffer = buffer.reverse().sort(compareTimestamp);
            maxTime = buffer[buffer.length - 1].timestamp;
        }
        response.writeHead(200, {
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        });

        while (!check.is_finished) {
            await sleep(process.env.MEASUREMENT_UPDATE_TIMEOUT);
            check = await Measurement.findOne({ where: { id: id }, raw: true });

            getData = await MeasurementParameterDataFragment.findAll({
                where: {
                    measurement_id: id,
                    measurement_parameter_name: param,
                    [Op.and]: [
                        where(cast(col("timestamp"), "timestamptz"), ">", cast(maxTime, "timestamptz")),
                    ],
                }, raw: true,
            });
            buffer = getData;
            if (buffer.length === 0) {
                continue;
            }
            buffer = buffer.reverse().sort(compareTimestamp);
            maxTime = buffer[buffer.length - 1].timestamp;
            buffer = buffer.map(value => {
                return {
                    timestamp: value.timestamp.valueOf(),
                    data: value.data,
                };
            });

            response.write(sse.stringify({
                isFinished: check.is_finished,
                data: buffer,
            }));
        }
        response.end();
    } catch (err) {
        next(err);
    }
}

async function measurementStop(request, response, next) {
    const id = request.body.measurementId;
    try {
        const check = await Measurement.findOne({
            where: {
                id: id
            }, raw: true});
        if (check === null) {
            next(new error.DeleteError({
                code: 404,
                message: "Measurement is not found",
                param: {
                    name: "measurementId"
                }
            }));
            return;
        }
        await Measurement.update({is_finished: true},{where: {id: id}});
        await Device.update({measurement_id: null},{where: {id: check.device_id, measurement_id: id}});
        response.json({
           id: id,
           startTimestamp: check.start_timestamp,
           deviceId: check.device_id,
           patientId: check.patient_id,
           isFinished: check.is_finished
        });
    } catch (err) {
        next(err);
    }
}

async function measurementPushData(request, response, next) {
    const id = request.body.measurementId;
    const time = request.body.timestamp;
    const mac = request.body.macAddress;
    const data = request.body.data;
    try {

        let reg = await Device.findOne({ where: { mac_address: mac }, raw: true });
        if (reg === null || mac === null) {
            next(new error.DataMeasureError({
                code: 403,
                message: "MAC is not linked",
                param: {
                    name: "macAddress",
                },
            }));
            return;
        }

        const check = await Measurement.findOne({ where: { id: id }, raw: true });
        if (check === null || (reg.measurement_id !== null && reg.measurement_id !== id)) {
            next(new error.DataMeasureError({
                code: 404,
                message: "Measurement was not found",
                param: {
                    name: "measurementId",
                },
            }));
            return;
        }
        if (check.is_finished) {
            next(new error.DataMeasureError({
                code: 405,
                message: "Measurement is finished",
                param: {
                    name: "measurementId",
                },
            }));
            return;
        }
        if (data === null) {

            await Measurement.update({ is_finished: true }, { where: { id: id } });

            await Device.update({ measurement_id: null }, { where: { measurement_id: id } });
            response.json({
                code: 204,
                message: "Measurement id finished",
            });
            return;
        }
        let boolCheck = false;
        let array = [];
        for (let key in data) {
            const dataTypes = _.uniq(data[key].map(value => typeof value));
            const ofSameType = dataTypes.length === 1;
            if (ofSameType) {

                let pCheck = await MeasurementParameterData.findOne({
                    where: { measurement_id: id, name: key },
                    raw: true,
                });
                if (pCheck === null) {
                    if (data[key].length === 0) {
                        array.push({
                            parameter: key,
                            result: {
                                code: 400,
                                message: "Unknown data type",
                            },
                        });
                        boolCheck = true;
                        continue;
                    }
                    await MeasurementParameterData.create({
                        measurement_id: id,
                        name: key,
                        type: typeof (data[key][0]),
                    });
                }
                await MeasurementParameterDataFragment.create({
                    measurement_id: id,
                    measurement_parameter_name: key,
                    timestamp: new Date(time),
                    data: data[key],
                });
                array.push({
                    parameter: key,
                    result: {
                        code: 200,
                    },
                });
            } else {
                boolCheck = true;
                array.push({
                    parameter: key,
                    result: {
                        code: 400,
                        message: "Invalid type",
                    },
                });
            }
        }
        if (boolCheck) {
            response.status(400);
            response.json({
                code: 400,
                details: array,
            });
        } else {
            response.status(200);
            response.json({
                code: 200,
            });
        }
    } catch (err) {
        next(err);
    }
}

export default {
    create: [
        validator.body("deviceId").exists().isString().notEmpty(),
        validator.body("patientId").exists().isString().notEmpty(),
        measurementCreate,
    ],
    info: [
        validator.param("id").exists().isString().notEmpty(),
        measurementInfo,
    ],
    stop: [
        validator.body("measurementId").exists().isString().notEmpty(),
        measurementStop,
    ],
    view: [
        validator.param("id").exists().isString().notEmpty(),
        validator.param("param").exists().isString().notEmpty(),
        measurementView,
    ],
    viewLive: [
        validator.param("id").exists().isString().notEmpty(),
        validator.param("param").exists().isString().notEmpty(),
        measurementViewLive,
    ],
    pushData: [
        validator.body("measurementId").exists().isString().notEmpty(),
        validator.body("timestamp").exists().isNumeric({ no_symbols: true }),
        validator.body("macAddress").exists().isMACAddress(),
        validator.body("data").exists().isArray(),
        measurementPushData,
    ],
};