'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TradeAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TradeAttachment.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    document: DataTypes.BLOB,
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trade_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TradeAttachment',
  });
  return TradeAttachment;
};