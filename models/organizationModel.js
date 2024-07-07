import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Organization = sequelize.define('Organization', {
    orgId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
});

export default Organization;
