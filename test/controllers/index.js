const { Op } = require('sequelize');
const { Good } = require('../models');



exports.renderMain = async (req, res, next) => {
  try {
    /**const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
    const goods = await Good.findAll({
      where: { SoldId: null, createdAt: { [Op.gte]: yesterday } },
    });**/
    res.render('start' ,/**{
      title: 'NodeAuction',
      goods,
    }**/);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderJoin = (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeAuction',
  });
};

exports.renderlogin = (req, res) => {
  res.render('main');
};

exports.renderGood = (req, res) => {
  res.render('good', { title: '상품 등록 - NodeAuction' });
};

