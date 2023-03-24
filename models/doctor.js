import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class doctor extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("doctor", {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            specialization: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            login: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        }, {
            tableName: "doctor",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "IX_doctor_login",
                    unique: true,
                    fields: [
                        { name: "login" },
                    ],
                },
                {
                    name: "PK_doctor",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ],
                },
            ],
        });
    }
}
