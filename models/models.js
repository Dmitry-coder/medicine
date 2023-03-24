import { sequelize } from "../db.js";
import { initModels } from "./raw-models.js";

const models = initModels(sequelize);

export const Device = models.device;
export const Diagnosis = models.diagnosis;
export const Doctor = models.doctor;
export const DoctorToPatient = models.doctor_2_patient;
export const Measurement = models.measurement;
export const MeasurementParameterData = models.measurement_parameter_data;
export const MeasurementParameterDataFragment = models.measurement_parameter_data_fragment;
export const Patient = models.patient;
export const PatientToDiagnosis = models.patient_2_diagnosis;