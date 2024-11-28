const Joi = require("joi");

const { BadRequestError } = require("../../../utilities/errors");

const updateUserSchema = Joi.object({
	name: Joi.string().trim().min(3).max(30).required(),
	email: Joi.string().trim().email().required(),
});

const updateUserValidator = (req, res, next) => {
	const { error, value } = updateUserSchema.validate(req.body, {
		stripUnknown: true,
		convert: true,
	});
	if (error) throw new BadRequestError(error.details[0].message);

	// setting transformed value to request body object
	req.body = value;
	next();
};

module.exports = { updateUserValidator };
