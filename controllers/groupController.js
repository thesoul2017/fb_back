const {Group, GroupUser} = require("../models/models");
const ApiError = require('../error/ApiError');

class GroupController {
    async create(req, res, next) {
        try {
            const {code} = req.body;
            const group = await Group.create({code});
            return res.json(group);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async addUser(req, res, next) {
        try {
            const {userId, groupId} = req.body;
            const item = await GroupUser.create({userId, groupId});
            return res.json(item);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async removeUser(req, res, next) {
        try {
            const {id} = req.params;
            await GroupUser.destroy({where: {id}});
            return res.status(200).json({message: 'Success'});
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async findGroupByCode(req, res, next) {
        try {
            const {code} = req.body;
            const group = await Group.findOne({where: {code}});

            if (!group) {
                return next(ApiError.badRequest('Группа не найдена'));
            }

            return res.json(group);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async findGroupByUser(req, res, next) {
        try {
            const {userId} = req.body;
            const group = await GroupUser.findOne({where: {userId}, include: Group});

            if (!group) {
                return res.status(200).json({message: 'Группа не найдена'});
            }

            return res.json(group);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
}

    async fundUsersInGroup(req, res, next) {
        try {
            const {userId} = req.body;
            const group = await GroupUser.findOne({where: {userId}});

            if (!group) {
                return res.status(200).json({message: 'Групп не найдено'});
            }

            const users = await GroupUser.findAll({where: {groupId: group.groupId}}).then(data => {
                return data.map(item => item.userId);
            });

            return res.json(users);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }
}

module.exports = new GroupController();
