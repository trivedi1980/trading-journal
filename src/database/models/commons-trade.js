'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommonsTrade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CommonsTrade.init({
    trade_open_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    trade_close_date: DataTypes.DATE,
    ticker: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entry_reason: DataTypes.STRING,
    plan_details: DataTypes.STRING,
    exit_reason: DataTypes.STRING,
    stock_price_at_open: DataTypes.FLOAT,
    stock_price_at_exit: DataTypes.FLOAT,
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trade_outcome: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['P', 'L', 'BE']],
          msg: 'Must be either P for profit, L for loss or BE for break-even'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'CommonsTrade',
  });
  return CommonsTrade;
};