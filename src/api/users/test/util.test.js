const LinkHeader = require('http-link-header');

const { addNextLinkHeader } = require('../src/util');
const { User } = require('../src/models/user');

const { USERS_URL } = process.env;

describe('util', () => {
  describe('addNextLinkHeader', () => {
    const createUser = (email) =>
      new User({
        firstName: 'Carl',
        lastName: 'Sagan',
        email,
        displayName: 'Carl Sagan',
        isAdmin: true,
        isFlagged: true,
        feeds: ['https://carl.blog.com/feed'],
        github: {
          username: 'carlsagan',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        },
      });

    // Simulate an HTTP response. We only care about being able to set a header value.
    const createResponse = () => ({
      headers: {},
      set(key, value) {
        this.headers = {
          [key]: value,
        };
      },
    });

    let response;
    let users;

    beforeEach(() => {
      response = createResponse();
      users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => createUser(`user${num}@email.com`));
    });

    test('should add valid Link rel=next header to response', () => {
      addNextLinkHeader(response, users, 10);
      const lastUser = users[users.length - 1];

      const linkHeader = response.headers.Link;
      expect(typeof linkHeader === 'string').toBe(true);

      const link = LinkHeader.parse(linkHeader);
      expect(link.has('next')).toBe(true);

      const next = link.get('next');
      expect(Array.isArray(next)).toBe(true);
      expect(next.length).toBe(1);
      expect(next[0].rel).toBe('next');
      expect(next[0].uri).toBe(`${USERS_URL}?start_after=${lastUser.id}&per_page=${10}`);
    });

    test('should not add Link header to response if there are no users', () => {
      addNextLinkHeader(response, [], 10);
      const linkHeader = response.headers.Link;
      expect(typeof linkHeader === 'undefined').toBe(true);
    });

    test('should not add Link header to response if there are fewer than perPage users', () => {
      addNextLinkHeader(response, users, 20);
      const linkHeader = response.headers.Link;
      expect(typeof linkHeader === 'undefined').toBe(true);
    });
  });
});
