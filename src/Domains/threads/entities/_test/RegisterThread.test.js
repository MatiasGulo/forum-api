const RegisterThread = require('../RegisterThread');

describe('A RegisterThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'title',
      body: 'body',
    };

    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: true,
      body: 'false',
      owner: 123,
    };

    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registerThread object correctly', () => {
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'user-123',
    };

    const { title, body, owner } = new RegisterThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
