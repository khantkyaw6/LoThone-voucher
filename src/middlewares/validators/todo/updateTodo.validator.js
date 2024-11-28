const Joi = require("joi");

const { BadRequestError } = require("../../../utilities/errors");

const updateTodoSchema = Joi.object({
	user_id: Joi.number().integer().optional(),
	description: Joi.string().trim().lowercase().optional(),
	completed_flag: Joi.boolean()
		.optional()
		.custom((value, helpers) => {
			console.log("values ", value);
			if (value === true) return 1;
			if (value === false) return 0;

			return helpers.error("any.invalid");
		})
});

const updateTodoValidator = (req, res, next) => {
	const { error, value } = updateTodoSchema.validate(req.body, {
		stripUnknown: true,
		convert: true
	});
	if (error) throw new BadRequestError(error.details[0].message);

	// setting transformed value to request body object
	req.body = value;
	next();
};

module.exports = { updateTodoValidator };
