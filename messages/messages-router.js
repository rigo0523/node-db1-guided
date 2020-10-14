const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM messages;`
		const messages = await db.select("*").from("messages")
		res.json(messages)
	} catch (err) {
		next(err)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM messages WHERE id = ? LIMIT 1;`
		const [message] = await db
			.select("*")
			.from("messages")
			.where("id", req.params.id)
			.limit(1)
		
		res.json(message)
	} catch (err) {
		next(err)
	}
})

router.post("/", async (req, res, next) => {
	try {
		// be specific with a payload object rather than passing
		// `req.body` directly to insert, so the user doesn't try to
		// send data we are auto-generating in the database
		const payload = {
			title: req.body.title,
			contents: req.body.contents,
		}

		if (!payload.title || !payload.contents) {
			return res.status(400).json({
				message: "Need a title and contents",
			})
		}

		// translates to `INSERT INTO messages (title, contents) VALUES (?, ?);`
		const [id] = await db.insert(payload).into("messages")

		res.status(201).json(await getMessageByID(id))
	} catch (err) {
		next(err)
	}
})

router.put("/:id", async (req, res, next) => {
	try {
		// be specific with a payload object rather than passing
		// `req.body` directly to insert, so the user doesn't try to
		// send data we are auto-generating in the database
		const payload = {
			title: req.body.title,
			contents: req.body.contents,
		}

		if (!payload.title || !payload.contents) {
			return res.status(400).json({
				message: "Need a title and contents",
			})
		}

		// translates to `UPDATE messages SET title = ? AND contents = ? WHERE id = ?;`
		await db("messages").where("id", req.params.id).update(payload)

		res.json(await getMessageByID(req.params.id))
	} catch (err) {
		next(err)
	}
})

router.delete("/:id", async (req, res, next) => {
	try {
		// translates to `DELETE FROM messages WHERE id = ?;`
		await db("messages").where("id", req.params.id).del()

		// no longer have a resource to return, but it was deleted successfully
		// (204 means success but empty response)
		res.status(204).end()
	} catch (err) {
		next(err)
	}
})

function getMessageByID(id) {
	return db
		.first("*") // a shortcut for destructuring the array and limit 1
		.from("messages")
		.where("id", id)
}

module.exports = router