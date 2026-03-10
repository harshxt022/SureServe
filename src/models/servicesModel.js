const db = require('../config/db');

class ServicesModel {
  static async getAllServices() {
    const query = 'SELECT * FROM services';
    const [rows] = await db.query(query);
    return rows;
  }
}

module.exports = ServicesModel;
