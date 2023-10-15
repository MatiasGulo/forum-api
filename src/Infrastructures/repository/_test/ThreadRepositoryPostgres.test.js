const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      const registerThread = new RegisterThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepoPostgres.addThread(registerThread);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      const registerThread = new RegisterThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const registeredThread = await threadRepoPostgres.addThread(registerThread);

      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread', () => {
    it('should not throw NotFoundError when thread is not available', async () => {
      await ThreadsTableTestHelper.addThread({});
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepoPostgres.verifyAvailableThread('threadId')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should verifyAvailable correctly', async () => {
      const threadId = await ThreadsTableTestHelper.addThread({});
      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepoPostgres.verifyAvailableThread(threadId)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread', () => {
    it('should return thread details correctly', async () => {
      const threadId = await ThreadsTableTestHelper.addThread({});

      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {});

      const threadDetails = await threadRepoPostgres.getDetailThread(threadId);

      expect(threadDetails).toHaveProperty('id', 'thread-123');
      expect(threadDetails).toHaveProperty('title', 'title');
      expect(threadDetails).toHaveProperty('body', 'body');
      expect(threadDetails).toHaveProperty('username', 'dicoding');
      expect(threadDetails).toHaveProperty('date');
    });

    it('should not throw NotFoundError when thread is not available', async () => {
      await ThreadsTableTestHelper.addThread({});

      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepoPostgres.getDetailThread('thread-456')).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
