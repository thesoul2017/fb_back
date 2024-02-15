const {Category} = require('../models/models');
const ApiError = require('../error/ApiError');

class CategoryController {
    async create(req, res, next) {
        try {
            const {name, icon} = req.body;
            const category = await Category.create({name, icon});
            return res.json(category);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }

    async getAll(req, res, next) {
        try {
            const categories = await Category.findAll({order: ['name']});
            return res.json(categories);
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }
}

module.exports = new CategoryController();
