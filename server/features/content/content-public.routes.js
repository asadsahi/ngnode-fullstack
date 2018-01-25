let express = require('express'),
    router = express.Router(),
    contentPolicy = require('./content.policy'),
    contentCtrl = require('./content.controller');

// select all
module.exports = (app) => {
    // Content collection routes
    app.route('/api/content/list')
        .get(contentCtrl.list);
}
