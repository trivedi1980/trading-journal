'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PriceAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PriceAction.init({
    ticker: DataTypes.STRING,
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['DAILY', 'INTRA_15', 'INTRA_5', 'INTRA_30']],
          msg: 'invalid period provided'
        }
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PriceAction',
  });
  return PriceAction;
};