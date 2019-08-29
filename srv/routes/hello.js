'use strict';
module.exports = function(app) {
    app.get('/hello', function(req, res) {
        return res.send('Hello World!')
    });
};