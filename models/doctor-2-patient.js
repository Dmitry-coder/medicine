import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class doctor2Patient extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("doctor_2_patient", {
            doctor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "doctor",
                    key: "id",
                },
            },
            patient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "patient",
                    key: "id",
                },
            },
        }, {
            tableName: "doctor_2_patient",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IXFK_doctor_2_patient_doctor",
                    fields: [
                        { name: "doctor_id" },
                    ],
                },
                {
                    name: "IXFK_doctor_2_patient_patient",
                    fields: [
                        { name: "patient_id" },
                    ],
                },
                {
                    name: "PK_doctor_2_patient",
                    unique: true,
                    fields: [
                        { name: "patient_id" },
                        { name: "doctor_id" },
                    ],
                },
            ],
        });
    }
}
