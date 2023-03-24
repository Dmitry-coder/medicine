import validator from "express-validator";

import error from "./error.js";
import { Doctor } from "./models/models.js";

async function doctorInfo(request, response, next) {
    const doctorId = request.params.id;
    try {

        const check = await Doctor.findOne({ where: { id: +doctorId }, raw: true });
        if (check === null) {
            next(new error.DoctorError({
                code: 404,
                message: "Doctor was not found",
                param: {
                    name: "id",
                },
            }));
            return;
        }
        response.json({
            id: check.id,
            name: check.name,
            specialization: check.specialization,
        });
    } catch (err) {
        next(err);
    }

}

export default {
    info: [
        validator.param("id").isString().notEmpty(),
        doctorInfo,
    ],
};