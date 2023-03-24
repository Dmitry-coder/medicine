import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class device extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("device", {
            id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            mac_address: {
                type: DataTypes.STRING(17),
                allowNull: true,
            },
            measurement_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
                references: {
                    model: "measurement",
                    key: "id",
                },
            },
        }, {
            tableName: "device",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IXFK_device_measurement",
                    fields: [
                        { name: "measurement_id" },
                    ],
                },
                {
                    name: "IX_device_mac_address",
                    unique: true,
                    fields: [
                        { name: "mac_address" },
                    ],
                },
                {
                    name: "PK_device",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ],
                },
            ],
        });
    }
}
