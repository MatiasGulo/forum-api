const RegisterComment = require('../RegisterComment');

describe('a RegisterComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'threadId',
      content: 'content',
    };

    expect(() => new RegisterComment(payload)).toThrowError('REGISTER_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 'threadId',
      content: [],
      owner: ['owner'],
    };

    expect(() => new RegisterComment(payload)).toThrowError('REGISTER_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registerComment object correctly', () => {
    const payload = {
      threadId: 'threadId',
      content: 'content',
      owner: 'owner',
    };

    const {
      threadId, content, owner,
    } = new RegisterComment(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
