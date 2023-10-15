const RegisteredComment = require('../RegisteredComment');

describe('a RegisteredComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'id',
      content: 'content',
    };

    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: [],
      content: 'content',
      owner: ['owner'],
    };

    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeComment object correctly', () => {
    const payload = {
      id: 'id',
      content: 'content',
      owner: 'owner',
    };

    const { id, content, owner } = new RegisteredComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
