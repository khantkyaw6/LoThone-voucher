// if (process.env.NODE_ENV === "development") {
require("dotenv").config();
// }

const bcrypt = require("bcrypt");

const hashPassword = async (plainText) => {
	const hashedPassword = await bcrypt.hash(
		plainText,
		process.env.SALT_ROUND * 1
	);
	return hashedPassword;
};

module.exports = { hashPassword };
