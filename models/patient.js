import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class patient extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("patient", {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            first_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            patronymic: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            birthdate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
        }, {
            tableName: "patient",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "PK_patient",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ],
                },
            ],
        });
    }
}
