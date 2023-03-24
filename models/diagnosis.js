import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class diagnosis extends Model {
    static init(sequelize, DataTypes) {
        return sequelize.define("diagnosis", {
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
        }, {
            tableName: "diagnosis",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "PK_diagnosis",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ],
                },
            ],
        });
    }
}
