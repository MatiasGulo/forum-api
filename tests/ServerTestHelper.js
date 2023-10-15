/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ServerTestHelper = {
  async getAccessToken() {
    const addUserPayload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [
        addUserPayload.id,
        addUserPayload.username,
        addUserPayload.password,
        addUserPayload.fullname],
    };
    await pool.query(query);

    const generateAccessToken = Jwt.token.generate(addUserPayload, process.env.ACCESS_TOKEN_KEY);
    const generateRefreshToken = Jwt.token.generate(addUserPayload, process.env.REFRESH_TOKEN_KEY);
    const saveToken = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [generateRefreshToken],
    };
    await pool.query(saveToken);

    return generateAccessToken;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

module.exports = ServerTestHelper;
