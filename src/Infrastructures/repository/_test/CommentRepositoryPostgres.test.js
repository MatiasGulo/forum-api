const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      await ThreadsTableTestHelper.addThread({});
      const registerComment = new RegisterComment({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(registerComment);

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      await ThreadsTableTestHelper.addThread({});
      const registerComment = new RegisterComment({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commenRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const registeredComment = await commenRepositoryPostgres.addComment(registerComment);

      expect(registeredComment).toStrictEqual(new RegisteredComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should verifyCommentAccess correctly', async () => {
      const commenRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      await expect(commenRepositoryPostgres.verifyCommentAccess({
        commentId: 'comment-123',
        owner: 'user-123',
      })).resolves.not.toThrowError();
    });

    it('should throw NotFoundError when comment is not found', async () => {
      const commenRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commenRepositoryPostgres.verifyCommentAccess('comment', 'owner')).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError when has no access delete to comment', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      await expect(commentRepositoryPostgres.verifyCommentAccess({
        commentId: 'comment-123',
        owner: 'owner',
      })).rejects.toThrow(AuthorizationError);
    });
  });

  describe('getComment function', () => {
    it('should return comments correctly', async () => {
      const threadId = await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commenRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      const comment = await commenRepositoryPostgres.getComment(threadId);

      expect(comment).toHaveLength(1);
      expect(comment[0].id).toEqual('comment-123');
      expect(comment[0].content).toEqual('content');
      expect(comment[0].is_delete).toEqual(false);
      expect(comment[0].username).toEqual('dicoding');
      expect(comment[0].date).toBeDefined();
    });
  });

  describe('deleteComment function', () => {
    it('should delete token from database', async () => {
      await ThreadsTableTestHelper.addThread({});
      const commentId = await CommentsTableTestHelper.addComment({});
      const commenRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      await commenRepositoryPostgres.deleteComment({ commentId });

      const coment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(coment[0].is_delete).toBe(true);
    });
  });
});
