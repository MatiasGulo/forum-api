const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getDetailThread(threadId);
    const comments = await this._commentRepository.getComment(threadId);

    return {
      ...thread,
      comments: comments.map((comment) => ({
        ...new DetailComment({
          ...comment,
          date: comment.date.toString(),
        }),
      })),
    };
  }
}

module.exports = GetThreadDetailUseCase;
