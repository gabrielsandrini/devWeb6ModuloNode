require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'development' ? false : true,
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
