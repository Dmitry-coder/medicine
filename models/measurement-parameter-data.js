import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class measurementParameterData extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("measurement_parameter_data", {
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true,
            },
            measurement_id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "measurement",
                    key: "id",
                },
            },
            type: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        }, {
            tableName: "measurement_parameter_data",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IXFK_measurement_parameter_data_measurement",
                    fields: [
                        { name: "measurement_id" },
                    ],
                },
                {
                    name: "PK_measurement_parameter_data",
                    unique: true,
                    fields: [
                        { name: "name" },
                        { name: "measurement_id" },
                    ],
                },
            ],
        });
    }
}
