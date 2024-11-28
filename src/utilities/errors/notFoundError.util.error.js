const CustomApiError = require("./CustomApiError.util.error");

class NotFoundError extends CustomApiError {
	constructor(message, cause = "not found error") {
		super(message, cause);
		this.statusCode = 404;
		this.name = this.constructor.name;
	}
}
module.exports = { NotFoundError };
