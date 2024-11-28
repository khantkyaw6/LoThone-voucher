class CustomApiError extends Error {
	constructor(message, cause) {
		super(message);
		this.name = this.constructor.name;
		this.cause = cause;
	}
}

module.exports = CustomApiError;
