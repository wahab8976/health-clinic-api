const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string()
    .max(30)
    .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/))
    .required(),
  firstName: Joi.string().trim().uppercase().required(),
  lastName: Joi.string().trim().uppercase().required(),
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))
    .required(),
  gender: Joi.string()
    .uppercase()
    .valid("MALE", "FEMALE", "OTHER")
    .required(),
  address: Joi.string().trim().required(),
  specialization: Joi.string().trim().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  emailOrUsername: Joi.string().trim().lowercase().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().uppercase(),
  lastName: Joi.string().trim().uppercase(),
  gender: Joi.string().uppercase().valid("MALE", "FEMALE", "OTHER"),
  specialization: Joi.string().trim(),
  address: Joi.string().trim(),
  password: Joi.string(),
  oldPassword: Joi.string()
  .when("password", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  })
  .invalid(Joi.ref("password"))
  .messages({
    "any.invalid": "password and oldPassword must not be same",
  }),
})
.with("oldPassword", "password")
.messages({
  "object.with": "password is required",
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};