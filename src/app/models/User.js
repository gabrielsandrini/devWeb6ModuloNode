import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        rg: Sequelize.STRING,
        cpf: Sequelize.STRING,
        medical_records_id: Sequelize.STRING,
        phone: Sequelize.STRING,
        crm: Sequelize.STRING,
        city: Sequelize.STRING,
        street: Sequelize.STRING,
        house_number: Sequelize.STRING,
        complement: Sequelize.STRING,
        is_admin: Sequelize.BOOLEAN,
        is_doctor: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
