const { createTodoTable } = require("./todo.model");
const { createUserTable } = require("./user.model");

const initTables = async () => {
	try {
		await createUserTable();
		await createTodoTable();
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = initTables;
