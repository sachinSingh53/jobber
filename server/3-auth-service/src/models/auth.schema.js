import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import bcrypt from 'bcryptjs';

const SALT_ROUND = 10;

const AuthModel = sequelize.define('auths', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        // type: DataTypes.STRING,
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            unique: true,
            fields: ['username']
        },
        {
            unique: true,
            fields: ['emailVerificationToken']
        }
    ]
});

AuthModel.addHook('beforeCreate', async (auth) => {
    const hashedPassword = await bcrypt.hash(auth.getDataValue('password'), SALT_ROUND);
    auth.setDataValue('password', hashedPassword);
});

AuthModel.prototype.comparePassword = async function (password,hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};
AuthModel.prototype.hashPassword = async function (password) {
    return await bcrypt.hash(password,SALT_ROUND);
};

// force:true --> this will delete the table whenever the server gets restarted
AuthModel.sync();

export { AuthModel };
