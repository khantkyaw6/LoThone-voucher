const Joi = require("joi");
const { BadRequestError } = require("../../../utilities/errors");

const getParamIdSchema = Joi.object({
	id: Joi.number().integer().required(),
});

const getParamIdValidator = (req, res, next) => {
	const { error, value } = getParamIdSchema.validate(req.params, {
		stripUnknown: true,
		convert: true,
	});

	if (error) throw new BadRequestError("Invalid url parameters");
	req.params = { ...req.params, id: value.id };

	next();
};

module.exports = { getParamIdValidator };
