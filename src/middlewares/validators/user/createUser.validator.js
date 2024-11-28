const Joi = require("joi");

const { BadRequestError } = require("../../../utilities/errors");

const createUserSchema = Joi.object({
	name: Joi.string().trim().min(3).max(30).lowercase().required(),
	email: Joi.string().trim().email().required(),
	password: Joi.string().min(8).max(256).required()
});

const createUserValidator = (req, res, next) => {
	const { error, value } = createUserSchema.validate(req.body, {
		stripUnknown: true,
		convert: true
	});
	if (error) throw new BadRequestError(error.details[0].message);

	// setting transformed value to request body object
	req.body = value;
	next();
};

module.exports = { createUserValidator };
