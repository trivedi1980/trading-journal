'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SrLevels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SrLevels.init({
    ticker: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
    levels: DataTypes.JSON
  },
   {
    sequelize,
    modelName: 'SrLevels',
  });
  return SrLevels;
};