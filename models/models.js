const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false}
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    icon: {type: DataTypes.STRING},
    type: {type: DataTypes.INTEGER, allowNull: false},
})

const Budget = sequelize.define('budget', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sum: {type: DataTypes.FLOAT, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    date: {type: DataTypes.DATE, allowNull: false},
    type: {type: DataTypes.INTEGER, allowNull: false},
})

const Group = sequelize.define('group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING, allowNull: false},
})

const GroupUser = sequelize.define('group_user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasMany(Budget);
Budget.belongsTo(User);

Category.hasMany(Budget);
Budget.belongsTo(Category);

Group.hasMany(GroupUser);
GroupUser.belongsTo(Group);

User.hasMany(GroupUser);
GroupUser.belongsTo(User);

module.exports = {
    User,
    Category,
    Budget,
    Group,
    GroupUser
}
