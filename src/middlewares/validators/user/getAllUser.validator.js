const Joi = require("joi");
const { BadRequestError } = require("../../../utilities/errors");

const getAllUserSchema = Joi.object({
	name: Joi.string().trim().optional(),
	email: Joi.string().trim().email().optional(),
	start_date: Joi.date().iso().optional(),
	end_date: Joi.date().iso().optional()
});

const getAllUserValidator = (req, res, next) => {
	const { error, value } = getAllUserSchema.validate(req.query, {
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

module.exports = { getAllUserValidator };
