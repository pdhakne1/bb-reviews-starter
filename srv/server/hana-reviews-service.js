'use strict'

function hanaReviewsService() {
    const dbClass = require("../utils/dbPromises");
    this.getAll = async function (req) {
        return await this.get(req.db, `SELECT REVIEWEE_EMAIL as "reviewee_email", REVIEWER_EMAIL as "reviewer_email", RATING as "rating", COMMENT as "comment" FROM BB_REVIEWS`, []);
    }

    this.getAllFor = async function (revieweeEmail, req) {
        return await this.get(req.db, `SELECT REVIEWEE_EMAIL as "reviewee_email", REVIEWER_EMAIL as "reviewer_email", RATING as "rating", COMMENT as "comment" FROM BB_REVIEWS WHERE REVIEWEE_EMAIL = ?`, [revieweeEmail]);
    }


    this.getAverageRating = async function (revieweeEmail, req) {
        const results = await this.get(req.db, `SELECT  avg(RATING) as "average_rating" FROM BB_REVIEWS WHERE REVIEWEE_EMAIL = ?`, [revieweeEmail]);
        return results[0];
    }

    async function sleep(req) {
        let db = new dbClass(req);
        const hdbext = require("@sap/hdbext");
        const sp = await db.loadProcedurePromisified(hdbext, null, 'sleep');
        const results = await db.callProcedurePromisified(sp, []);
        return results;
    }
    this.sleep = sleep;


    this.create = async function (review, req) {
        let db = new dbClass(req.db);
        try {
            const statement = await db.preparePromisified(`INSERT INTO BB_REVIEWS (REVIEWEE_EMAIL, REVIEWER_EMAIL, RATING, COMMENT) values(?, ?, ?, ?)`);
            await db.statementExecPromisified(statement, [review.reviewee_email, review.reviewer_email, review.rating, review.comment]);
            return; 
        } catch (error) {
            console.log("Inside create error:" + JSON.stringify(error));
            // queue this if db offline error and try again later.
            db.insertReviewToQueue(review, `INSERT INTO BB_REVIEWS (REVIEWEE_EMAIL, REVIEWER_EMAIL, RATING, COMMENT) values(?, ?, ?, ?)`, db);
            return;     
        }
    }

    this.deleteAll = async function (req) {
        let db = new dbClass(req.db);
        const statement = await db.preparePromisified(`delete from BB_REVIEWS`);
        await db.statementExecPromisified(statement, []);
        return

    }

    this.get = async function (db, query, params) {
        let dbObject = new dbClass(db);
        try {
            const statement = await dbObject.preparePromisified(query);
            return await dbObject.statementExecPromisified(statement, params);
        } catch (error) {
            const cachedResult = dbObject.getFromCache(query, params);
            if (cachedResult) {
                return cachedResult;
            }
            throw error;
        }
    }
}
module.exports = hanaReviewsService