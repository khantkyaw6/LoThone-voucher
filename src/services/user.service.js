const db = require("../db/db");
const serviceAsyncWrapper = require("../utilities/serviceAsyncWrapper.util");
const { hashPassword } = require("../utilities/password.util");
const {
	NotFoundError
} = require("../utilities/errors/notFoundError.util.error");

class UserService {
	constructor() {
		this.getAllUser = serviceAsyncWrapper(this.getAllUser.bind(this));
		this.createUser = serviceAsyncWrapper(this.createUser.bind(this));
		this.getUser = serviceAsyncWrapper(this.getUser.bind(this));
		this.updateUser = serviceAsyncWrapper(this.updateUser.bind(this));
		this.deleteUser = serviceAsyncWrapper(this.deleteUser.bind(this));
	}

	async getAllUser(filters, pagination) {
		const params = [];
		const conditions = [];

		if (filters.name) {
			conditions.push("u.name like ?");
			params.push(`%${filters.name}%`);
		}
		if (filters.email) {
			conditions.push("u.email = ?");
			params.push(filters.email);
		}
		if (filters.start_date) {
			conditions.push("u.created_at >= ?");
			params.push(filters.start_date);
		}
		if (filters.end_date) {
			conditions.push("u.created_at <= ?");
			params.push(filters.end_date);
		}

		let getSql = `
			select 	u.id,
					u.name,
					u.email,
					u.created_at,
					json_arrayagg(
						json_object(
							'id', t.id,
							'description', t.description,
							'completed_flag', t.completed_flag,
							'created_at', t.created_at
						)
					) as todos
			from	users u
			left join todos t
			on		u.id = t.user_id
			group by u.id
		`;
		let countSql = `
			select 	count(*) as total
			from	users u
		`;
		// Checking if there are any conditions
		if (conditions.length > 0) {
			const formattedCondition = conditions.join(" and ");
			getSql += " where " + formattedCondition;
			countSql += " where " + formattedCondition;
		}
		// to get the total row count before adding limit and offset to params
		const [[{ total }]] = await db.query(countSql, params);

		// adding pagination to the query
		const limit = pagination.entriesPerPage;
		const offset = pagination.page * limit;
		getSql += " order by created_at desc limit ? offset ?";
		params.push(limit, offset);
		const [rows] = await db.query(getSql, params);

		const metaData = {
			...pagination,
			page: pagination.page + 1,
			totalResult: total,
			foundResult: rows.length
		};
		return [rows, metaData];
	}

	async getUser(id) {
		const getQuery = `
			select 	u.id,
					u.name,
					u.email,
					u.created_at,
					json_arrayagg(
						json_object(
							'id', t.id,
							'description', t.description,
							'completed_flag', t.completed_flag,
							'created_at', t.created_at
						)
					) as todos
			from	users u
			left join todos t
			on		u.id = t.user_id
			where	u.id = ?
			group by u.id
		`;

		const [[row]] = await db.query(getQuery, [id]);
		if (!row) throw new NotFoundError("User not found");

		console.log(row.todos);
		return row;
	}

	async createUser({ name, email, password }) {
		const hashedPassword = await hashPassword(password);
		const insertQuery = `
				insert into users(name, email, password)
				values (?, ?, ?);
			`;
		const result = await db.query(insertQuery, [
			name,
			email,
			hashedPassword
		]);
		if (result && result[0].affectedRows) {
			const insertedId = result[0].insertId;
			const getQuery = `
					select 	id,
							name,
							email,
							created_at
					from	users
					where	id = ?;
				`;
			// quering the newly put row from the database to return immediately
			const [[row]] = await db.query(getQuery, [insertedId]);
			return row;
		}
	}

	async updateUser(id, { name, email }) {
		const conditions = [];
		const params = [];

		if (name) {
			conditions.push("name = ?");
			params.push(name);
		}
		if (email) {
			conditions.push("email = ?");
			params.push(email);
		}

		if (conditions.length === 0)
			throw new BadRequestError("No fields provided to update");

		let updateQuery =
			`update users set ` + conditions.join(", ") + " where id = ?";

		params.push(id);

		const result = await db.query(updateQuery, params);
		if (result && result[0].affectedRows) {
			return `User updated successfully`;
		} else {
			throw new NotFoundError("User not found");
		}
	}

	async deleteUser(id) {
		const deleteQuery = `
			delete  from users
			where	id = ?
		`;
		const result = await db.query(deleteQuery, [id]);
		if (result && result[0].affectedRows) {
			return `User deleted successfully`;
		} else {
			throw new NotFoundError("User not found");
		}
	}
}
module.exports = UserService;

// const getQuery = `
// 	select 	u.id,
// 			u.name,
// 			u.email,
// 			u.created_at,
// 			GROUP_CONCAT(
// 				JSON_OBJECT(
// 					'id', t.id,
// 					'description', t.description,
// 					'completed_flag', t.completed_flag,
// 					'created_at', t.created_at
// 				)
// 			) as todos
// 	from	users u
// 	left join todos t
// 	on		u.id = t.user_id
// 	where	u.id = ?
// 	group by u.id
// `;
