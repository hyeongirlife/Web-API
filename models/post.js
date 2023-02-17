module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "post",
    {
      content: {
        type: DataTypes.STRING(140),
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
};
