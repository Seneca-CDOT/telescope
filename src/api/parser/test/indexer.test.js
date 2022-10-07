const { Elastic, logger } = require('@senecacdot/satellite');
const { waitOnReady, indexPost, deletePost } = require('../src/utils/indexer');

const index = 'posts';

describe('Indexer tests', () => {
  const { mock } = Elastic();
  const loggerSpy = jest.spyOn(logger, 'error').mockImplementation((msg) => msg);
  afterEach(() => {
    mock.clearAll();
    jest.clearAllMocks();
  });

  const mockPost = {
    id: 1111,
    text: 'mock text 1',
    title: 'mock title 1',
    published: '2015-01-01',
    author: 'mock author 1',
  };

  const otherPost = {
    id: 2222,
    text: 'mock text 2',
    title: 'mock title 2',
    published: '2015-01-01',
    author: 'mock author 2',
  };

  describe('"Posts" index creation tests', () => {
    const createSpy = jest.fn().mockReturnValue({});
    const esMock = (indexName) => {
      mock.add(
        {
          method: 'PUT',
          path: `/${indexName}`,
        },
        createSpy
      );
    };

    it('Established connection and successful index creation should have no errors or logged errors', async () => {
      esMock(index);
      await waitOnReady();
      expect(createSpy).toHaveBeenCalled();
      expect(loggerSpy).toBeCalledTimes(0);
    });

    it('Established connection but unsuccessful index creation will have logged errors', async () => {
      // The mock below is used to force an ElasticSearch error to occur.
      esMock('otherIndex');
      await waitOnReady();
      expect(createSpy).toBeCalledTimes(0);
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toBeCalledTimes(1);
      expect(loggerSpy.mock.lastCall[1]).toStrictEqual(`Error setting up ${index} index`);
    });
  });

  describe('Indexing posts tests', () => {
    const indexingSpy = jest.fn().mockReturnValue({
      _index: `${index}`,
      _id: `${mockPost.id}`,
      _version: 1,
      result: 'created',
    });
    beforeEach(() => {
      mock.add(
        {
          method: 'PUT',
          path: `/${index}/_doc/${mockPost.id}`,
        },
        indexingSpy
      );
    });

    it('Successful indexing should have no logged errors', async () => {
      await indexPost(mockPost);
      expect(indexingSpy).toHaveBeenCalled();
      expect(loggerSpy).toBeCalledTimes(0);
    });

    it('Unsuccessful indexing will have logged errors', async () => {
      // The function call below is used to force an ElasticSearch error to occur.
      await indexPost(otherPost);
      expect(indexingSpy).toBeCalledTimes(0);
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toBeCalledTimes(1);
      expect(loggerSpy.mock.lastCall[1]).toStrictEqual(
        `There was an error indexing a post for id ${otherPost.id}`
      );
    });
  });

  describe('Deleting posts tests', () => {
    const deleteSpy = jest.fn().mockReturnValue({});
    beforeEach(() => {
      mock.add(
        {
          method: 'DELETE',
          path: `/${index}/_doc/${mockPost.id}`,
        },
        deleteSpy
      );
    });

    it('Successful deletion should have no logged errors', async () => {
      await deletePost(mockPost.id);
      expect(deleteSpy).toHaveBeenCalled();
      expect(loggerSpy).toBeCalledTimes(0);
    });

    it('Unsuccessful deletion will have logged errors', async () => {
      // The function call below is used to force an ElasticSearch error to occur.
      await deletePost(otherPost.id);
      expect(deleteSpy).toBeCalledTimes(0);
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toBeCalledTimes(1);
      expect(loggerSpy.mock.lastCall[1]).toStrictEqual(
        `There was an error deleting the post with id ${otherPost.id}`
      );
    });
  });
});
