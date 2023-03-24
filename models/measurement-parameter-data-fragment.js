import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class measurementParameterDataFragment extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("measurement_parameter_data_fragment", {
            measurement_id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "measurement_parameter_data",
                    key: "measurement_id",
                },
            },
            measurement_parameter_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "measurement_parameter_data",
                    key: "name",
                },
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                primaryKey: true,
            },
            data: {
                type: DataTypes.JSON,
                allowNull: false,
            },
        }, {
            tableName: "measurement_parameter_data_fragment",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IXFK_measurement_parameter_data_fragment_measurement_parameter_",
                    fields: [
                        { name: "measurement_parameter_name" },
                        { name: "measurement_id" },
                    ],
                },
                {
                    name: "IX_measurement_data_timestamp",
                    fields: [
                        { name: "timestamp", order: "DESC" },
                    ],
                },
                {
                    name: "PK_measurement_parameter_data_fragment",
                    unique: true,
                    fields: [
                        { name: "measurement_id" },
                        { name: "measurement_parameter_name" },
                        { name: "timestamp" },
                    ],
                },
            ],
        });
    }
}
