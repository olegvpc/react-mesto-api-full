const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const usersRoute = require('./users');
const cardsRoute = require('./cards');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/not-found-error');
const { REGEX_URL } = require('../utils/regex-url');

const routes = express.Router();

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(REGEX_URL),
    }),
  }),
  createUser,
);

routes.use('/users', usersRoute);
routes.use('/cards', auth, cardsRoute);
routes.use('*', (req, res, next) => {
  const err = new NotFoundError('Неверный адрес запроса');
  return next(err);
});

module.exports = { routes };
