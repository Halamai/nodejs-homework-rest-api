const Joi = require("joi");

const validation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  }).min(1);

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

const userValidator = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    next(new ValidationErr(validationResult.error.details));
  }
  next();
};

module.exports = { userValidator, validation };
