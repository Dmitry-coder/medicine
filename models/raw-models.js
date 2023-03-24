import _sequelize from "sequelize";
import _device from "./device.js";
import _diagnosis from "./diagnosis.js";
import _doctor_2_patient from "./doctor-2-patient.js";
import _doctor from "./doctor.js";
import _measurement_parameter_data_fragment from "./measurement-parameter-data-fragment.js";
import _measurement_parameter_data from "./measurement-parameter-data.js";
import _measurement from "./measurement.js";
import _patient_2_diagnosis from "./patient-2-diagnosis.js";
import _patient from "./patient.js";

const DataTypes = _sequelize.DataTypes;

export function initModels(sequelize) {
    const device = _device.init(sequelize, DataTypes);
    const diagnosis = _diagnosis.init(sequelize, DataTypes);
    const doctor = _doctor.init(sequelize, DataTypes);
    const doctor_2_patient = _doctor_2_patient.init(sequelize, DataTypes);
    const measurement = _measurement.init(sequelize, DataTypes);
    const measurement_parameter_data = _measurement_parameter_data.init(sequelize, DataTypes);
    const measurement_parameter_data_fragment = _measurement_parameter_data_fragment.init(sequelize, DataTypes);
    const patient = _patient.init(sequelize, DataTypes);
    const patient_2_diagnosis = _patient_2_diagnosis.init(sequelize, DataTypes);

    diagnosis.belongsToMany(patient, {
        as: "patient_id_patient_patient_2_diagnoses",
        through: patient_2_diagnosis,
        foreignKey: "diagnosis_id",
        otherKey: "patient_id",
    });
    doctor.belongsToMany(patient, {
        as: "patient_id_patients",
        through: doctor_2_patient,
        foreignKey: "doctor_id",
        otherKey: "patient_id",
    });
    measurement_parameter_data.belongsToMany(measurement_parameter_data, {
        as: "measurement_parameter_name_measurement_parameter_data",
        through: measurement_parameter_data_fragment,
        foreignKey: "measurement_id",
        otherKey: "measurement_parameter_name",
    });
    measurement_parameter_data.belongsToMany(measurement_parameter_data, {
        as: "measurement_id_measurement_parameter_data",
        through: measurement_parameter_data_fragment,
        foreignKey: "measurement_parameter_name",
        otherKey: "measurement_id",
    });
    patient.belongsToMany(diagnosis, {
        as: "diagnosis_id_diagnoses",
        through: patient_2_diagnosis,
        foreignKey: "patient_id",
        otherKey: "diagnosis_id",
    });
    patient.belongsToMany(doctor, { as: "doctor_id_doctors", through: doctor_2_patient, foreignKey: "patient_id", otherKey: "doctor_id" });
    measurement.belongsTo(device, { as: "device_device", foreignKey: "device_id" });
    device.hasMany(measurement, { as: "device_measurements", foreignKey: "device_id" });
    patient_2_diagnosis.belongsTo(diagnosis, { as: "diagnosis", foreignKey: "diagnosis_id" });
    diagnosis.hasMany(patient_2_diagnosis, { as: "patient_2_diagnoses", foreignKey: "diagnosis_id" });
    doctor_2_patient.belongsTo(doctor, { as: "doctor", foreignKey: "doctor_id" });
    doctor.hasMany(doctor_2_patient, { as: "doctor_2_patients", foreignKey: "doctor_id" });
    device.belongsTo(measurement, { as: "measurement", foreignKey: "measurement_id" });
    measurement.hasMany(device, { as: "devices", foreignKey: "measurement_id" });
    measurement_parameter_data.belongsTo(measurement, { as: "measurement", foreignKey: "measurement_id" });
    measurement.hasMany(measurement_parameter_data, { as: "measurement_parameter_data", foreignKey: "measurement_id" });
    measurement_parameter_data_fragment.belongsTo(measurement_parameter_data, { as: "measurement", foreignKey: "measurement_id" });
    measurement_parameter_data.hasMany(measurement_parameter_data_fragment, {
        as: "measurement_parameter_data_fragments",
        foreignKey: "measurement_id",
    });
    measurement_parameter_data_fragment.belongsTo(measurement_parameter_data, {
        as: "measurement_parameter_name_measurement_parameter_datum",
        foreignKey: "measurement_parameter_name",
    });
    measurement_parameter_data.hasMany(measurement_parameter_data_fragment, {
        as: "measurement_parameter_name_measurement_parameter_data_fragments",
        foreignKey: "measurement_parameter_name",
    });
    doctor_2_patient.belongsTo(patient, { as: "patient", foreignKey: "patient_id" });
    patient.hasMany(doctor_2_patient, { as: "doctor_2_patients", foreignKey: "patient_id" });
    measurement.belongsTo(patient, { as: "patient", foreignKey: "patient_id" });
    patient.hasMany(measurement, { as: "measurements", foreignKey: "patient_id" });
    patient_2_diagnosis.belongsTo(patient, { as: "patient", foreignKey: "patient_id" });
    patient.hasMany(patient_2_diagnosis, { as: "patient_2_diagnoses", foreignKey: "patient_id" });

    return {
        device,
        diagnosis,
        doctor,
        doctor_2_patient,
        measurement,
        measurement_parameter_data,
        measurement_parameter_data_fragment,
        patient,
        patient_2_diagnosis,
    };
}
