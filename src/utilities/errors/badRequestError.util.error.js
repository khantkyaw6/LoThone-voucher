const CustomApiError = require("./CustomApiError.util.error");

class BadRequestError extends CustomApiError {
	constructor(message, cause = "Bad request error") {
		super(message, cause);
		this.statusCode = 400;
		this.name = this.constructor.name;
	}
}

module.exports = { BadRequestError };
