const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread) {
    const { title, body, owner } = registerThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads(id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, new Date().toISOString()],
    };

    const result = await this._pool.query(query);

    return new RegisteredThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not available');
    }
  }

  async getDetailThread(threadId) {
    const query = {
      text: `SELECT
      threads.id,
      threads.title,
      threads.body,
      threads.date,
      users.username
      FROM threads JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not available');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
