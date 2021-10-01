import Sequelize from 'sequelize';

import DatabaseConfig from '../config/database';

import User from '../app/models/User';
import Appointment from '../app/models/Appointment';

const models = [User, Appointment];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(process.env.DATABASE_URL, DatabaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
