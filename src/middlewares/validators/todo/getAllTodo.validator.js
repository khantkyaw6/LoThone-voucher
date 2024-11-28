const Joi = require("joi");
const { BadRequestError } = require("../../../utilities/errors");

const getAllTodoSchema = Joi.object({
	user_id: Joi.number().integer().optional(),
	description: Joi.string().trim().lowercase().optional(),
	completed_flag: Joi.string().custom((value, helpers) => {
		if (value === "true") return 1;
		if (value === "false") return 0;

		// return helpers.error("any.invalid");
		return helpers.message(
			"The 'completed_flag' field must be either 'true' or 'false'."
		);
	}),
	start_date: Joi.date().iso().optional(),
	end_date: Joi.date().iso().optional()
});

const getAllTodoValidator = (req, res, next) => {
	const { error, value } = getAllTodoSchema.validate(req.query, {
		stripUnknown: true,
		convert: true
	});
	if (error) throw new BadRequestError(error.details[0].message);

	// Adjust end_date to the last second of the day
	if (value.end_date) {
		const endDate = new Date(value.end_date);
		// Set to 23:59:59 of the end date
		endDate.setHours(23, 59, 59, 999);
		value.end_date = endDate.toISOString();
	}
	// setting transformed value to request query object
	req.query = value;
	next();
};

module.exports = { getAllTodoValidator };
