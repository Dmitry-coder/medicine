import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class patient_2_diagnosis extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("patient_2_diagnosis", {
            diagnosis_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "diagnosis",
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
            tableName: "patient_2_diagnosis",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IXFK_patient_2_diagnosis_diagnosis",
                    fields: [
                        { name: "diagnosis_id" },
                    ],
                },
                {
                    name: "IXFK_patient_2_diagnosis_patient",
                    fields: [
                        { name: "patient_id" },
                    ],
                },
                {
                    name: "PK_patient_2_diagnosis",
                    unique: true,
                    fields: [
                        { name: "diagnosis_id" },
                        { name: "patient_id" },
                    ],
                },
            ],
        });
    }
}
