let DB = require('../../db/models'),
    ContentText = DB.ContentText,
    Content = DB.Content,
    Language = DB.Language,
    errorHandler = require('../core/errorHandler');

/**
 * For site display purpose
 */
exports.setLanguage = async (req, res) => {
    if (req.body.culture) {
        res.cookie('lang', req.body.culture)
    }
    res.redirect('/');
};

exports.get = async (req, res) => {
    var languages = await Language.findAll({});
    var language = languages.find(l => l.locale == (req.cookies['lang'] || 'en-US'));

    ContentText.findAll({
        include: [{
            model: DB.Content
        }],
        where: {
            languageid: language.id
        }
    }).then(list => {
        let content = {};

        list.forEach(item => {
            content[item.Content.key] = item.text;
        });


        const appData = {
            cultures: languages.map(l => {
                return {
                    value: l.locale,
                    text: `${l.description} - (${l.locale})`,
                    current: (req.cookies['lang'] || 'en-US') === l.locale
                }
            }),
            content: content

        };
        res.json(appData);
    }).catch(err => {
        if (err) return console.error(err);
        res.status(400).send(err);
    });
};

