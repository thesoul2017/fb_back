const {Budget, Category, User, GroupUser} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");
const sequelize = require('../db');

class BudgetController {
    async create(req, res, next) {
        try {
            const {sum, description, type, date, userId, categoryId} = req.body;
            const budget = await Budget.create({sum, description, type, date, userId, categoryId});
            return res.json(budget);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await Budget.destroy({where: {id}});
            return res.status(200).json({message: 'Success'});
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.body;
            await Budget.update(req.body, {where: {id}});
            return res.status(200).json({message: 'Success'});
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    // array userId
    async getByUserId(req, res, next) {
        try {
            let {userId, limit, page, sort, filter} = req.body;
            page = page || 1;
            limit = limit || 9;
            sort = sort || ['createdAt', 'ASC'];
            let offset = page * limit - limit;
            let budget;
            filter = filter ?
                {date: {[Op.between]: [new Date(filter[0]).toISOString(), new Date(filter[1]).toISOString()]}} : {};

            budget = await Budget.findAndCountAll({
                where: {
                    userId: userId,
                    ...filter
                },
                order: [sort],
                limit,
                offset,
                include: [
                    {model: Category, attributes: ['name', 'icon']},
                    {model: User, attributes: ['first_name']}
                ]
            });

            return res.json(budget);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async getGroupByType(req, res, next) {
        try {
            let {userId, filter} = req.body;
            let budget;

            filter = filter ?
                {date: {[Op.between]: [new Date(filter[0]).toISOString(), new Date(filter[1]).toISOString()]}} : {};

            budget = await Budget.findAll({
                where: {
                    userId: userId,
                    ...filter
                },
                attributes: [
                    'type',
                    [sequelize.fn('sum', sequelize.col('sum')), 'total']
                ],
                group: ['type'],
            });

            return res.json(budget);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async getGroupByDate(req, res, next) {
        try {
            let {userId, filter} = req.body;
            let limit = 999;

            let up;
            let down;
            let sort = ['date', 'ASC'];

            filter = filter ?
                {date: {[Op.between]: [new Date(filter[0]).toISOString(), new Date(filter[1]).toISOString()]}} : {};

            up = await Budget.findAll({
                where: {
                    userId: userId,
                    type: 2,
                    ...filter
                },
                attributes: [
                    ['date', 'x'],
                    [sequelize.fn('sum', sequelize.col('sum')), 'total']
                ],
                group: [
                    'date',
                ],
                order: [sort],
                limit,
            });

            down = await Budget.findAll({
                where: {
                    userId: userId,
                    type: 1,
                    ...filter
                },
                attributes: [
                    ['date', 'x'],
                    [sequelize.fn('sum', sequelize.col('sum')), 'total']
                ],
                group: [
                    'date',
                ],
                order: [sort],
                limit,
            });

            return res.json({up, down});
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async getGroupByCategory(req, res, next) {
        try {
            let {userId, filter} = req.body;
            let limit = 999;

            let budget;

            filter = filter ?
                {date: {[Op.between]: [new Date(filter[0]).toISOString(), new Date(filter[1]).toISOString()]}} : {};

            budget = await Budget.findAll({
                where: {
                    userId: userId,
                    ...filter
                },
                attributes: [
                    'categoryId',
                    [sequelize.fn('sum', sequelize.col('sum')), 'total']
                ],
                group: [
                    'categoryId',
                    'category.id',
                ],
                limit,
                include: [
                    {model: Category, attributes: ['name', 'icon']},
                ]
            });

            return res.json(budget);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }
}

module.exports = new BudgetController();
