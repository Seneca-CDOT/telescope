const request = require('supertest');
const { Elastic, createError } = require('@senecacdot/satellite');
const { app } = require('../src');

const { POSTS_URL } = process.env;

console.log(
  '****************************************\n' +
    'The logs are in slient mode.\nTo change it, go to ../jest-setup.js\n' +
    '**************************************'
);
describe('/query routers', () => {
  // Create the mock client.
  const { mock } = new Elastic();

  afterEach(() => {
    mock.clearAll();
  });

  it('return error 400 if no params given', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(400);
  });

  // ElasticSearch-mock does not currently work with ElasticSearch v8.0.0
  // See issue https://github.com/elastic/elasticsearch-js-mock/issues/22
  // All queries that pass validation will have to be temporarily commented out

  // it('return error 400 if no filter is given', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return {};
  //     }
  //   );
  //   const res = await request(app).get('/').query({ text: 'Telescope', filter: '' });
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toStrictEqual([
  //     { location: 'query', msg: 'filter should exist', param: 'filter', value: '' },
  //   ]);
  // });

  // it('return error 400 if given wrong filter', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return {};
  //     }
  //   );
  //   const res = await request(app).get('/').query({ text: 'Telescope', filter: 'pos' });
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toStrictEqual([
  //     { location: 'query', msg: 'invalid filter value', param: 'filter', value: 'pos' },
  //   ]);
  // });

  // it('return error 400 if no text is given', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return {};
  //     }
  //   );
  //   const res = await request(app).get('/').query({ text: '', filter: 'post' });
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toStrictEqual([
  //     { location: 'query', msg: 'text should not be empty', param: 'text', value: '' },
  //   ]);
  // });

  // it('return 200 with empty results if text is given ""', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return {
  //         results: 0,
  //         hits: {
  //           total: { value: 0 },
  //           hits: [],
  //         },
  //       };
  //     }
  //   );
  //   const res = await request(app).get('/').query({ text: '""', filter: 'post' });
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toStrictEqual({ results: 0, values: [] });
  // });

  // it('return 200 if filter by post and given text', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return {
  //         results: 2,
  //         hits: {
  //           total: { value: 2 },
  //           hits: [
  //             {
  //               _id: '1234',
  //               url: `${POSTS_URL}/`,
  //             },
  //             {
  //               _id: '5678',
  //               url: `${POSTS_URL}/`,
  //             },
  //           ],
  //         },
  //       };
  //     }
  //   );
  //   const res = await request(app).get('/').query({ text: 'Telescope', filter: 'post' });
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.results).toBe(2);
  //   expect(res.body.values).toStrictEqual([
  //     { id: '1234', url: `${POSTS_URL}/1234` },
  //     { id: '5678', url: `${POSTS_URL}/5678` },
  //   ]);
  // });

  // it('return 200 if filter by author and given text', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return {
  //         results: 2,
  //         hits: {
  //           total: { value: 2 },
  //           hits: [
  //             {
  //               _id: '9966',
  //               url: `${POSTS_URL}/`,
  //             },
  //             {
  //               _id: '1122',
  //               url: `${POSTS_URL}/`,
  //             },
  //           ],
  //         },
  //       };
  //     }
  //   );
  //   const res = await request(app).get('/').query({ text: 'Bob', filter: 'author' });
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.results).toBe(2);
  //   expect(res.body.values).toStrictEqual([
  //     { id: '9966', url: `${POSTS_URL}/9966` },
  //     { id: '1122', url: `${POSTS_URL}/1122` },
  //   ]);
  // });

  // it('return 503 if return from Elasticsearch does not have proper format', async () => {
  //   mock.add(
  //     {
  //       method: ['POST', 'GET'],
  //       path: '/posts/post/_search',
  //     },
  //     () => {
  //       return { Hitt: 'Junk' };
  //     }
  //   );

  //   const res = await request(app).get('/').query({ text: 'a', filter: 'post' });
  //   expect(res.statusCode).toBe(503);
  // });
});

describe('/advanced query routers', () => {
  describe('Test queries that do not pass validation', () => {
    it('Return error 400 if missing all 3 of "post", "author", and "title" param', async () => {
      let res = await request(app).get('/advanced');
      expect(res.status).toBe(400);

      res = await request(app).get('/advanced').query({ to: '2020-04-05' });
      expect(res.status).toBe(400);

      res = await request(app).get('/advanced').query({ from: '2020-04-05' });
      expect(res.status).toBe(400);

      res = await request(app).get('/advanced').query({ perPage: 1 });
      expect(res.status).toBe(400);

      res = await request(app).get('/advanced').query({ page: 0 });
      expect(res.status).toBe(400);

      res = await request(app).get('/advanced').query({ someParam: 'someParam' });
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            { msg: 'author should exist', param: 'author', location: 'body' },
            { msg: 'title should exist', param: 'title', location: 'body' },
          ],
        },
      ]);
    });

    it('Return error 400 if "post" param is empty', async () => {
      const res = await request(app).get('/advanced').query({ post: '' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { value: '', msg: 'post should not be empty', param: 'post', location: 'query' },
            { msg: 'author should exist', param: 'author', location: 'body' },
            { msg: 'title should exist', param: 'title', location: 'body' },
          ],
        },
      ]);
    });

    it('Return error 400 if "post" param has a length greater than 256', async () => {
      const longString = 'a'.repeat(257);
      const res = await request(app).get('/advanced').query({ post: longString });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            {
              value: `${longString}`,
              msg: 'post should be between 1 to 256 characters',
              param: 'post',
              location: 'query',
            },
            { msg: 'author should exist', param: 'author', location: 'body' },
            { msg: 'title should exist', param: 'title', location: 'body' },
          ],
        },
      ]);
    });

    it('Return error 400 if "author" param is empty', async () => {
      const res = await request(app).get('/advanced').query({ author: '' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            { value: '', msg: 'author should exist', param: 'author', location: 'query' },
            { msg: 'title should exist', param: 'title', location: 'body' },
          ],
        },
      ]);
    });

    it('Return error 400 if "author" param does not have a length between 2 and 256', async () => {
      const longString = 'a'.repeat(257);
      let res = await request(app).get('/advanced').query({ author: 'a' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            { value: 'a', msg: 'invalid author value', param: 'author', location: 'query' },
            { msg: 'title should exist', param: 'title', location: 'body' },
          ],
        },
      ]);

      res = await request(app).get('/advanced').query({ author: longString });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            {
              value: `${longString}`,
              msg: 'invalid author value',
              param: 'author',
              location: 'query',
            },
            { msg: 'title should exist', param: 'title', location: 'body' },
          ],
        },
      ]);
    });

    it('Return error 400 if "title" param is empty', async () => {
      const res = await request(app).get('/advanced').query({ title: '' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            { msg: 'author should exist', param: 'author', location: 'body' },
            { value: '', msg: 'title should exist', param: 'title', location: 'query' },
          ],
        },
      ]);
    });

    it('Return error 400 if "title" param does not have a length between 2 and 256', async () => {
      const longString = 'a'.repeat(257);
      let res = await request(app).get('/advanced').query({ title: 'a' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            { msg: 'author should exist', param: 'author', location: 'body' },
            { value: 'a', msg: 'invalid title value', param: 'title', location: 'query' },
          ],
        },
      ]);

      res = await request(app).get('/advanced').query({ title: longString });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          msg: 'Invalid value(s)',
          param: '_error',
          nestedErrors: [
            { msg: 'post should not be empty', param: 'post', location: 'body' },
            { msg: 'author should exist', param: 'author', location: 'body' },
            {
              value: `${longString}`,
              msg: 'invalid title value',
              param: 'title',
              location: 'query',
            },
          ],
        },
      ]);
    });

    it('Return error 400 if "to" param has an invalid date format', async () => {
      let res = await request(app)
        .get('/advanced')
        .query({ post: 'ElasticSearch', to: 'invalid date format' });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toStrictEqual('invalid date format');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', to: '06/04/2020' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          value: '06/04/2020',
          msg: 'invalid date format',
          param: 'to',
          location: 'query',
        },
      ]);
    });

    it('Return error 400 if "from" param has an invalid date format', async () => {
      let res = await request(app)
        .get('/advanced')
        .query({ post: 'ElasticSearch', from: 'foo-bar 2020' });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toStrictEqual('foo-bar 2020');

      res = await request(app)
        .get('/advanced')
        .query({ post: 'ElasticSearch', from: '2020-25-23' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          value: '2020-25-23',
          msg: 'invalid date format',
          param: 'from',
          location: 'query',
        },
      ]);
    });

    it('Return error 400 if "perPage" param is not an integer between 1 to 10', async () => {
      let res = await request(app).get('/advanced').query({ post: 'ElasticSearch', perPage: 11 });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toBe('11');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', perPage: 0 });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toBe('0');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', perPage: 1.5 });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toBe('1.5');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', perPage: 'one' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          value: 'one',
          msg: 'perPage should be empty or a number between 1 to 10',
          param: 'perPage',
          location: 'query',
        },
      ]);
    });

    it('Return error 400 if "page" param is not an integer between 0 to 999', async () => {
      let res = await request(app).get('/advanced').query({ post: 'ElasticSearch', page: 1000 });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toBe('1000');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', page: -1 });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toBe('-1');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', page: 55.5 });
      expect(res.status).toBe(400);
      expect(res.body[0].value).toBe('55.5');

      res = await request(app).get('/advanced').query({ post: 'ElasticSearch', page: 'five' });
      expect(res.status).toBe(400);
      expect(res.body).toStrictEqual([
        {
          value: 'five',
          msg: 'page should be empty or a number between 0 to 999',
          param: 'page',
          location: 'query',
        },
      ]);
    });
  });

  // ElasticSearch-mock does not currently work with ElasticSearch v8.0.0
  // See issue https://github.com/elastic/elasticsearch-js-mock/issues/22
  // All queries that pass validation will have to be temporarily commented out

  // describe('Test queries that pass validation', () => {
  //   // All Satellite Elastic clients will share this mock
  //   // For more information please read the documentation at https://github.com/Seneca-CDOT/satellite#elastic
  //   const { mock } = Elastic();

  //   afterEach(() => {
  //     mock.clearAll();
  //   });

  //   describe('Return status 200 if params pass validation checks', () => {
  //     const mockResults = {
  //       hits: {
  //         total: { value: 0 },
  //         hits: [],
  //       },
  //     };

  //     beforeEach(() => {
  //       mock.add(
  //         {
  //           method: ['POST', 'GET'],
  //           path: '/posts/post/_search',
  //         },
  //         () => {
  //           return mockResults;
  //         }
  //       );
  //     });

  //     it(`Invalid "post" with valid "author" or "title" param should pass validation`, async () => {
  //       let res = await request(app).get('/advanced').query({ post: '', author: 'Roxanne' });
  //       expect(res.status).toBe(200);

  //       res = await request(app).get('/advanced').query({ post: '', title: 'OSD' });
  //       expect(res.status).toBe(200);

  //       res = await request(app)
  //         .get('/advanced')
  //         .query({ post: '', author: 'Roxanne', title: 'OSD' });
  //       expect(res.status).toBe(200);
  //       expect(res.body).toStrictEqual({ results: 0, values: [] });
  //     });

  //     it(`Invalid "author" with valid "post" or "title" param should pass validation`, async () => {
  //       let res = await request(app).get('/advanced').query({ author: '', post: 'ElasticSearch' });
  //       expect(res.status).toBe(200);

  //       res = await request(app).get('/advanced').query({ author: '', title: 'OSD' });
  //       expect(res.status).toBe(200);

  //       res = await request(app)
  //         .get('/advanced')
  //         .query({ author: '', post: 'ElasticSearch', title: 'OSD' });
  //       expect(res.status).toBe(200);
  //       expect(res.body).toStrictEqual({ results: 0, values: [] });
  //     });

  //     it(`Invalid "title" with valid "author" or "post" param should pass validation`, async () => {
  //       let res = await request(app).get('/advanced').query({ title: '', post: 'ElasticSearch' });
  //       expect(res.status).toBe(200);

  //       res = await request(app).get('/advanced').query({ title: '', author: 'Roxanne' });
  //       expect(res.status).toBe(200);

  //       res = await request(app)
  //         .get('/advanced')
  //         .query({ title: '', post: 'ElasticSearch', author: 'Roxanne' });
  //       expect(res.status).toBe(200);
  //       expect(res.body).toStrictEqual({ results: 0, values: [] });
  //     });
  //   });

  //   it('Search results of more than 0 return "id" and "url" of posts', async () => {
  //     const mockResults = {
  //       hits: {
  //         total: { value: 2 },
  //         hits: [{ _id: '1111' }, { _id: '2222' }],
  //       },
  //     };

  //     mock.add(
  //       {
  //         method: ['POST', 'GET'],
  //         path: '/posts/post/_search',
  //       },
  //       () => {
  //         return mockResults;
  //       }
  //     );

  //     const res = await request(app).get('/advanced').query({
  //       post: 'ElasticSearch',
  //       author: 'Roxanne',
  //       title: 'OSD',
  //       from: '2020-04-06',
  //       to: '2019-06-02',
  //       perPage: '2',
  //       page: '1',
  //     });

  //     expect(res.status).toBe(200);
  //     expect(res.body.results).toBe(2);
  //     expect(res.body.values).toStrictEqual([
  //       { id: '1111', url: `${POSTS_URL}/1111` },
  //       { id: '2222', url: `${POSTS_URL}/2222` },
  //     ]);
  //   });

  //   it('Return error 503 if "hits" returned from ElasticSearch is undefined', async () => {
  //     const mockResults = createError(404, 'Page Not Found');

  //     mock.add(
  //       {
  //         method: ['POST', 'GET'],
  //         path: '/posts/post/_search',
  //       },
  //       () => {
  //         return mockResults;
  //       }
  //     );

  //     const res = await request(app).get('/advanced').query({ post: 'ElasticSearch' });

  //     expect(res.status).toBe(503);
  //   });
  // });
});
