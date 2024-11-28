const Joi = require("joi");
const { BadRequestError } = require("../../../utilities/errors");

const getPagination = Joi.object({
	entriesPerPage: Joi.number().integer().default(10),
	page: Joi.number().integer().default(1),
});

const getPaginationValidator = (req, res, next) => {
	const { error, value } = getPagination.validate(req.query, {
		abortEarly: false,
		stripUnknown: true,
		convert: true,
	});
	if (error) throw new BadRequestError("Invalid pagination query parameters");
	req.pagination = { ...value, page: value.page - 1 };

	next();
};

module.exports = { getPaginationValidator };
