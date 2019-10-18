'use strict'
const CircuitBreaker = require('opossum');

const circuitBreakerOptions = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    resetTimeout: 30000 // After 30 seconds, try again.
  };

function hanaReviewsService() {
    const dbClass = require("../utils/dbPromises");

    var breakers = {};

    async function breaker(func, ...args) {
        var breaker = breakers[func];
        if (!breaker) {
            var breaker = new CircuitBreaker(func, circuitBreakerOptions);
            breaker.fallback(() => { return "Sorry the DB is down. Please retry later." });

            breakers[func] = breaker;
            breaker.on('success', () => console.log("success"));
            breaker.on('timeout', () => console.log("timeout"));
            breaker.on('reject', () => console.log("reject"));
            breaker.on('open', () => console.log("open"));  
            breaker.on('halfOpen', () => console.log("halfOpen"));
            breaker.on('close', () => console.log("close"));
        }

        var result = await breaker.fire(...args);
        return result;
    }

    this.getAll = async function(req) {   
        return await breaker(this._getAll, req)
    }
    
    this._getAll = async function (req) {
        let db = new dbClass(req.db);
        try {
            const statement = await db.preparePromisified(`SELECT REVIEWEE_EMAIL as "reviewee_email", REVIEWER_EMAIL as "reviewer_email", RATING as "rating", COMMENT as "comment" FROM BB_REVIEWS`);
            const results = await db.statementExecPromisified(statement, []);
            return results
        } catch (error) {
            return error;
        }

    }

    this.getAllFor = async function(revieweeEmail, req) {   
        return await breaker(this._getAllFor, revieweeEmail, req)
    }

    this._getAllFor = async function (revieweeEmail, req) {
        let db = new dbClass(req.db);
        const statement = await db.preparePromisified(`SELECT REVIEWEE_EMAIL as "reviewee_email", REVIEWER_EMAIL as "reviewer_email", RATING as "rating", COMMENT as "comment" FROM BB_REVIEWS WHERE REVIEWEE_EMAIL = ?`);
        const results = await db.statementExecPromisified(statement, [revieweeEmail]);
        return results
    }

    this.getAverageRating = async function(revieweeEmail, req) {   
        return await breaker(this._getAverageRating, revieweeEmail, req)
    }

    this._getAverageRating = async function (revieweeEmail, req) {
        let db = new dbClass(req.db);
        const statement = await db.preparePromisified(`SELECT  avg(RATING) as "average_rating" FROM BB_REVIEWS WHERE REVIEWEE_EMAIL = ?`);
        const results = await db.statementExecPromisified(statement, [revieweeEmail]);
        return results[0]
    }

    async function sleep(req) {
        let db = new dbClass(req);
        const hdbext = require("@sap/hdbext");
        const sp = await db.loadProcedurePromisified(hdbext, null, 'sleep');
        const results = await db.callProcedurePromisified(sp, []);
        return results;
    }
    this.sleep = sleep;

    this.create = async function(review, req) {   
        return await breaker(this._create, review, req)
    }

    this._create = async function (review, req) {
        let db = new dbClass(req.db);
        const statement = await db.preparePromisified(`INSERT INTO BB_REVIEWS (REVIEWEE_EMAIL, REVIEWER_EMAIL, RATING, COMMENT) values(?, ?, ?, ?)`);
        await db.statementExecPromisified(statement, [review.reviewee_email, review.reviewer_email, review.rating, review.comment]);
        return
    }

    this.deleteAll = async function(req) {   
        return await breaker(this._deleteAll, req)
    }

    this._deleteAll = async function (req) {
        let db = new dbClass(req.db);
        const statement = await db.preparePromisified(`delete from BB_REVIEWS`);
        await db.statementExecPromisified(statement, []);
        return

    }
}
module.exports = hanaReviewsService