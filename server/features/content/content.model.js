let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ContentSchema = new Schema({
    locale: String,
    description: String,
    contentList: [
        {
            key: String,
            value: String
        }
    ]
}, { collection: 'content' });

let Content = mongoose.model('Content', ContentSchema);

module.exports = Content;
