const db = require("../db/db");
const serviceAsyncWrapper = require("../utilities/serviceAsyncWrapper.util");

const {
	NotFoundError
} = require("../utilities/errors/notFoundError.util.error");

class TodoService {
	constructor() {
		this.getAllTodo = serviceAsyncWrapper(this.getAllTodo.bind(this));
		this.createTodo = serviceAsyncWrapper(this.createTodo.bind(this));
		this.getTodo = serviceAsyncWrapper(this.getTodo.bind(this));
		this.updateTodo = serviceAsyncWrapper(this.updateTodo.bind(this));
		this.deleteTodo = serviceAsyncWrapper(this.deleteTodo.bind(this));
	}

	async getAllTodo(filters, pagination) {
		const params = [];
		const conditions = [];

		if (filters.user_id) {
			conditions.push("t.user_id = ?");
			params.push(filters.user_id);
		}
		if (filters.description) {
			conditions.push("t.description = ?");
			params.push(filters.description);
		}
		if (filters.completed_flag === 0 || filters.completed_flag === 1) {
			conditions.push("t.completed_flag = ?");
			params.push(filters.completed_flag);
		}
		if (filters.start_date) {
			conditions.push("t.created_at >= ?");
			params.push(filters.start_date);
		}
		if (filters.end_date) {
			conditions.push("t.created_at <= ?");
			params.push(filters.end_date);
		}

		let getSql = `
			select 	t.id,
					u.id as user_id,
					u.name as user_name,
					t.description,
					t.completed_flag,
					t.created_at
			from	todos t
			left join users u
			on		t.user_id = u.id
		`;
		let countSql = `
			select 	count(*) as total
			from	todos t
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

	async getTodo(id) {
		const getQuery = `
			select 	id,
					user_id,
					description,
					completed_flag,
					created_at
			from	todos
			where	id = ?
		`;
		const [[row]] = await db.query(getQuery, [id]);
		if (!row) throw new NotFoundError("Todo not found");

		return row;
	}

	async createTodo({ user_id, description }) {
		const insertQuery = `
				insert into todos(user_id, description)
				values (?, ?);
			`;
		const result = await db.query(insertQuery, [user_id, description]);

		if (result && result[0].affectedRows) {
			const insertedId = result[0].insertId;
			const getQuery = `
					select 	id,
							user_id,
							description,
							completed_flag,
							created_at
					from	todos
					where	id = ?;
				`;
			// quering the newly put row from the database to return immediately
			const [[row]] = await db.query(getQuery, [insertedId]);
			return row;
		}
	}

	async updateTodo(id, { user_id, description, completed_flag }) {
		const conditions = [];
		const params = [];

		if (user_id) {
			conditions.push("user_id = ?");
			params.push(user_id);
		}
		if (description) {
			conditions.push("description = ?");
			params.push(description);
		}
		if (completed_flag === 0 || completed_flag === 1) {
			conditions.push("completed_flag = ?");
			params.push(completed_flag);
		}

		if (conditions.length === 0)
			throw new BadRequestError("No fields provided to update");

		let updateQuery =
			`update todos set ` + conditions.join(", ") + " where id = ?";

		params.push(id);

		const result = await db.query(updateQuery, params);
		if (result && result[0].affectedRows) {
			return `Todo updated successfully`;
		} else {
			throw new NotFoundError("Todo not found");
		}
	}

	async deleteTodo(id) {
		const deleteQuery = `
			delete  from todos
			where	id = ?
		`;
		const result = await db.query(deleteQuery, [id]);
		if (result && result[0].affectedRows) {
			return `Todo deleted successfully`;
		} else {
			throw new NotFoundError("Todo not found");
		}
	}
}
module.exports = TodoService;
