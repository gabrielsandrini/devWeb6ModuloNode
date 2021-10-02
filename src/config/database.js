require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  logging: true,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'development' ? false : true,
    rejectUnauthorized: false,
  },
  use_env_variable: 'DATABASE_URL',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
