const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');

const {
  PORT = 4000,
  BASE_PATH = `http://localhost:${PORT}`,
} = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
});

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(limiter);
app.use(requestLogger); // логирование запросов
app.use(cors);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// тестирование на восстановление работы сервера
// Не забыть удалить этот код после успешного прохождения ревью.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger); // логирование ошибок после запросов
app.use(errors()); // обработчик ошибок celebrate

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err; // установка дефолтного значения
//   res
//     .status(statusCode)
//     .send({
//       // проверяем статус и выставляем сообщение в зависимости от него
//       message: statusCode === 500
//         ? `На сервере произошла ошибка - middleware ${message} - ${err.name}`
//         : message,
//     });
//   next();
// });
app.use(handleError);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
