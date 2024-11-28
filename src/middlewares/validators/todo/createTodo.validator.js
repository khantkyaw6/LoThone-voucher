const Joi = require("joi");

const { BadRequestError } = require("../../../utilities/errors");

const createTodoSchema = Joi.object({
	user_id: Joi.number().integer().required(),
	description: Joi.string().trim().lowercase().max(300).required()
});

const createTodoValidator = (req, res, next) => {
	const { error, value } = createTodoSchema.validate(req.body, {
		stripUnknown: true,
		convert: true
	});
	if (error) throw new BadRequestError(error.details[0].message);

	// setting transformed value to request body object
	req.body = value;
	next();
};

module.exports = { createTodoValidator };
