import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class measurement extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("measurement", {
            id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true,
            },
            start_timestamp: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            patient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "patient",
                    key: "id",
                },
            },
            device_id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                references: {
                    model: "device",
                    key: "id",
                },
            },
            is_finished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        }, {
            tableName: "measurement",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IXFK_measurement_device",
                    fields: [
                        { name: "device_id" },
                    ],
                },
                {
                    name: "IXFK_measurement_patient",
                    fields: [
                        { name: "patient_id" },
                    ],
                },
                {
                    name: "IX_measurement_start_timestamp",
                    fields: [
                        { name: "start_timestamp" },
                    ],
                },
                {
                    name: "PK_measurement",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ],
                },
            ],
        });
    }
}
