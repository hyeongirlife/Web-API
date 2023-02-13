module.exports = (sequelize, DataTypes) => {
  sequelize.define(
    "user",
    {
      title: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
};
