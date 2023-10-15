const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get commented thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: 'date',
          content: 'content',
        },
        {
          id: 'comment-124',
          username: 'faisal',
          date: 'date',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentReposiotry = new CommentRepository();

    mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'dicoding',
    }));

    mockCommentReposiotry.getComment = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        username: 'dicoding',
        date: 'date',
        content: 'content',
        is_deleted: false,
      },
      {
        id: 'comment-124',
        username: 'faisal',
        date: 'date',
        content: 'content',
        is_deleted: true,
      },
    ]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentReposiotry,
    });

    const getDetailThread = await getThreadDetailUseCase.execute(useCasePayload);

    expect(getDetailThread).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentReposiotry.getComment).toBeCalledWith(useCasePayload.threadId);
  });
});
