const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'id',
      username: 'date',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'username',
      date: 'date',
      content: [],
      is_delete: false,
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create isDelete is true', () => {
    const payload = {
      id: 'id',
      username: 'username',
      date: 'date',
      content: 'content',
      is_delete: true,
    };

    const {
      id, username, date, content,
    } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });

  it('should create object correctly', () => {
    const payload = {
      id: 'id',
      username: 'username',
      date: 'date',
      content: 'content',
      is_delete: false,
    };

    const {
      id, username, date, content,
    } = new DetailComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
