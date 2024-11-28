const db = require("../db/db");

const createUserTable = async () => {
	const query = `
		create table if not exists users (
			id	int	primary key auto_increment,
			name	varchar(80) not null,
			email	varchar(100) not null unique,
			password varchar(255) not null,
			created_at timestamp default current_timestamp
		)
	`;

	await db.query(query);
};

module.exports = { createUserTable };
