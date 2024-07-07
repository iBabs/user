
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import Organization from './organizationModel.js';

const UserOrganization = sequelize.define('UserOrganization', {
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'userId',
        },
    },
    orgId: {
        type: DataTypes.UUID,
        references: {
            model: Organization,
            key: 'orgId',
        },
    },
});

User.belongsToMany(Organization, { through: UserOrganization });
Organization.belongsToMany(User, { through: UserOrganization });

sequelize.sync()

export default UserOrganization;
