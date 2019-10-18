'use strict';

module.exports = function (app) {
    const slowDown = require("express-slow-down");
	
	const postReviewLimiter = slowDown({
		windowMs: 1 * 60 * 1000, // 1 minutes
		delayAfter: 20, // allow 20 requests per 1 minutes, then...
        delayMs: 1000, // begin adding 1 s of delay per request above 20, and
        maxDelayMs: 10000 // max delay is 10 seconds
	});

	app.post(postReviewLimiter);
};