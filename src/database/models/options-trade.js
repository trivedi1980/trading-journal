'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OptionsTrade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  OptionsTrade.init({
    trade_open_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    trade_close_date: {
      type: DataTypes.DATE
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false
    },
    strike: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    exp_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    option_type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['CALL', 'PUT']],
          msg: 'Must be either Call or Put'
        }
      }
    },
    no_of_contracts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    close_price: DataTypes.FLOAT,
    entry_reason: DataTypes.STRING,
    plan_details: DataTypes.STRING,
    exit_reason: DataTypes.STRING,
    stock_price_at_open: DataTypes.FLOAT,
    stock_price_at_exit: DataTypes.FLOAT,
    trade_outcome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['P', 'L', 'BE']],
          msg: 'Must be either P for profit, L for loss or BE for break-even'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'OptionsTrade',
  });
  return OptionsTrade;
};