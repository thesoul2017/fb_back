const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Budget} = require('../models/models');

const generateJwt = (id, email, first_name, last_name) => {
    return jwt.sign(
        {id, email, first_name, last_name},
        process.env.SECURE_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, first_name, last_name} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректый email или password'));
        }

        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email существует'));
        }

        const hashPassword = await bcrypt.hash(password, 4);
        const user = await User.create({email, password: hashPassword, first_name, last_name});
        const token = generateJwt(user.id, user.email, user.first_name, user.last_name);

        return res.json({token});
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'));
        }

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'));
        }

        const token = generateJwt(user.id, user.email, user.first_name, user.last_name);
        return res.json({token});
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.first_name, req.user.last_name);
        return res.json({token});
    }

    async update(req, res, next) {
        try {
            const {id} = req.body;
            await User.update(req.body, {where: {id}});
            return res.status(200).json({message: 'Success'});
        } catch (e) {
            return next(ApiError.badRequest(e));
        }
    }
}

module.exports = new UserController();
