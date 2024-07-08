const Good = require("../models/good");
const User = require("../models/good");



exports.nextgood = async (req, res) => {

    try {
        const goods = await Good.findAll({
                attributes: ['name', 'nickname', 'tier', 'line', 'text']
        });

        res.json(goods);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
};
;

/*exports.user = async (req, res) => {

    try {
        
        const users = await User.findone({
                where : {
                    name : 
                }
        });

        res.json(users);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
};*/


