let express = require('express'),
    router = express.Router(),
    contentPolicy = require('./content.policy'),
    contentCtrl = require('./content.controller');

// select all
module.exports = (app) => {
    app.route('/api/content/:locale')
        .all(contentPolicy.isAllowed)
        .get(contentCtrl.get)
        .put(contentCtrl.put);
}
