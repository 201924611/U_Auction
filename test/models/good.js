const Sequelize = require('sequelize');

module.exports = class Good extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      tier: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      line: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING(20)
      }
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Good',
      tableName: 'goods',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Good.belongsTo(db.User, { as: 'Owner' });
    db.Good.belongsTo(db.User, { as: 'Sold' });
    db.Good.hasMany(db.Auction);
  }
};
