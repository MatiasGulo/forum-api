const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not meet data specification', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'commentId',
      threadId: [],
      owner: 'owner',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'threadId',
      commentId: 'commentId',
      owner: 'owner',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrow(InvariantError);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      ({
        threadId: 'threadId',
        commentId: 'commentId',
        owner: 'owner',
      }),
    );
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith(
      useCasePayload,
    );
  });
});
