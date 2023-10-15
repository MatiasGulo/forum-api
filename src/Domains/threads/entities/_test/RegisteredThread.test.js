const RegisteredThread = require('../RegisteredThread');

describe('a RegisteredThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'title',
      owner: 'owner',
    };

    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: {},
      title: 'true',
      owner: 123,
    };

    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new RegisteredThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
