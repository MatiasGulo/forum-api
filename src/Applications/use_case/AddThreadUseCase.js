const AddThread = require('../../Domains/threads/entities/AddThread');

class addThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const registerThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(registerThread);
  }
}

module.exports = addThreadUseCase;
