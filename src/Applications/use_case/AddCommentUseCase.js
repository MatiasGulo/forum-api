const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const registerComment = new AddComment(useCasePayload);
    await this._threadRepository.verifyThread(useCasePayload.threadId);
    return this._commentRepository.addComment(registerComment);
  }
}

module.exports = AddCommentUseCase;
