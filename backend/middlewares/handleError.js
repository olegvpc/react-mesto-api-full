function handleError(err, req, res, next) {
  const { statusCode = 500, message } = err; // установка дефолтного значения
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? `На сервере произошла ошибка - middleware ${message} - ${err.name}`
        : message,
    });
  next();
}

module.exports = { handleError };
