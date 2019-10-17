'use strict';
const HTTP_NO_CONTENT = 204
const HTTP_CREATED = 201
const HTTP_CONFLICT = 409
const HTTP_INTERNAL_ERROR = 500

module.exports = function(app) {

	app.get('/api/v1/reviews', async function readAll(req, res) {
		try {
			const result = await app.reviewsService.getAll(req)
			res.send(result)
		} catch (err) {
			res.status(HTTP_INTERNAL_ERROR)
			if (err.code === 'ETIMEDOUT') {
				res.send("Sorry the DB is down. Please retry later.");
			} else {
				res.send(err);
			}
		}
	})

	app.get('/api/v1/reviews/:revieweeEmail', async function readAll(req, res) {
		try {
			const revieweeEmail = req.params.revieweeEmail;
			const result = await app.reviewsService.getAllFor(revieweeEmail, req)
			res.send(result)
		} catch (err) {
			res.status(HTTP_INTERNAL_ERROR)
			if (err.code === 'ETIMEDOUT') {
				res.send("Sorry the DB is down. Please retry later.");
			} else {
				res.send(err);
			}
		}
	})

	app.get('/api/v1/averageRatings/:email', async function getAverageUserRating(req, res) {
		try {
			const result = await app.reviewsService.getAverageRating(req.params.email, req)
			res.send(result)
		} catch (err) {
			res.status(HTTP_INTERNAL_ERROR)
			if (err.code === 'ETIMEDOUT') {
                res.send("Sorry the DB is down. Please retry later.");
            } else {
				res.send(err);
			}
		}
	})

	app.post('/api/v1/reviews', async function create(req, res) {
		try {
			await app.reviewsService.create(req.body, req)
			res.status(HTTP_CREATED).location(req.body.component_name).end()
		} catch (err) {
			if (err.code === 'ETIMEDOUT') {
                res.status(HTTP_INTERNAL_ERROR).send("Sorry the DB is down. Please retry later.");
            } else {
				res.status(HTTP_CONFLICT).end();
			}
		}
	})

	app.delete('/api/v1/reviews', async function deleteAll(req, res) {
		try {
			var result = await app.reviewsService.deleteAll(req)
			if (!result) {
				res.status(HTTP_NO_CONTENT).end();
			} else {
				res.send(result);
			}
		} catch (err) {
			res.status(HTTP_INTERNAL_ERROR)
			if (err.code === 'ETIMEDOUT') {
                res.send("Sorry the DB is down. Please retry later.");
            } else {
				res.send(err);
			}
		}
	})

	app.get('/api/v1/sleep', async function sleep(req, res) {
            await app.reviewsService.sleep(req.db)
			let now = new Date();
			return res.type("text/plain").send(`Sleep time is over: ${now.toLocaleTimeString()}`)
	})
};