const { hash } = require('@senecacdot/satellite');

const {
  getUser,
  getUsersPaginated,
  createUsers,
  postUser,
  postUsers,
  putUser,
  deleteUser,
  deleteUsers,
} = require('./utils');

describe('GET REQUESTS', () => {
  const NUMBER_OF_USERS = 50;
  let allUsers = [];

  beforeAll(async () => {
    allUsers = createUsers(NUMBER_OF_USERS);
    await postUsers(allUsers);
  });

  afterAll(async () => {
    await deleteUsers(allUsers);
  });

  it('should get default number of users, /', async () => {
    // pagination is defaulted to 20 when no query is supplied
    // see models\schema.js
    const response = await getUsersPaginated();
    const users = await response.json();
    const DEFAULT_NUMBER_USERS = 20;

    expect(response.headers.get('link')).toBe(
      '<http://localhost/v1/users?start_after=71e7a5cacc&per_page=20>; rel=next'
    );

    expect(users).toEqual(createUsers(NUMBER_OF_USERS, true).slice(0, DEFAULT_NUMBER_USERS));
    expect(users.length).toBe(DEFAULT_NUMBER_USERS);
    expect(response.status).toBe(200);
  });

  it('should get all users, paginated', async () => {
    const PER_PAGE = 5;
    const userEmail = 'TelescopeUser31@email.com';
    const sortedUsers = createUsers(NUMBER_OF_USERS, true);
    const startAfterIndex = sortedUsers.findIndex((user) => user.email === userEmail) + 1;
    const nextPageFirstUserEmail = sortedUsers[startAfterIndex + PER_PAGE - 1].email;

    // start after user with email set in userEmail
    const response = await getUsersPaginated(
      `?per_page=${PER_PAGE}&start_after=${hash(userEmail)}`
    );
    const users = await response.json();

    expect(response.headers.get('link')).toBe(
      `<http://localhost/v1/users?start_after=${hash(
        nextPageFirstUserEmail
      )}&per_page=${PER_PAGE}>; rel=next`
    );
    expect(users).toEqual(
      createUsers(NUMBER_OF_USERS, true).slice(startAfterIndex, startAfterIndex + PER_PAGE)
    );
    expect(users.length).toBe(PER_PAGE);
    expect(response.status).toBe(200);
  });

  it('should return 404 if the user does not exist', async () => {
    const response = await getUser({ email: 'nonexistent@email.com' });
    expect(response.status).toBe(404);
  });

  it('should 400, rejected by negative per_page', async () => {
    // start_after does not matter, middleware should reject regardless
    const response = await getUsersPaginated('?per_page=-5');
    expect(response.status).toBe(400);
  });
});

describe('POST REQUESTS', () => {
  let galileo;

  beforeEach(() => {
    galileo = {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
      displayName: 'Sir Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'GalileoGalilei',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
  });

  it('should not post a user with missing first name info', async () => {
    delete galileo.firstName;
    const response = await postUser(galileo);
    const parsedResponse = await response.json();

    expect(parsedResponse.statusCode).toBe(400);

    await deleteUser(galileo);
  });

  it('should not post a user with missing last name info', async () => {
    delete galileo.lastName;
    const response = await postUser(galileo);
    const parsedResponse = await response.json();

    expect(parsedResponse.statusCode).toBe(400);

    await deleteUser(galileo);
  });

  it('should not allow the same user to be posted twice', async () => {
    await postUser(galileo);
    const response = await postUser(galileo);

    expect(response.status).toBe(409);

    await deleteUser(galileo);
  });

  it('user feed array should only contain URI strings', async () => {
    const response = await postUser({ ...galileo, feeds: [123] });
    const parsedResponse = await response.json();

    expect(parsedResponse.statusCode).toBe(400);

    await deleteUser(galileo);
  });
});

describe('PUT REQUESTS', () => {
  it('should update a single user', async () => {
    const carlSagan = {
      firstName: 'Carl',
      lastName: 'Sagan',
      email: 'carl_sagan@email.com',
      displayName: 'Carl Sagan',
      isAdmin: false,
      isFlagged: false,
      feeds: ['https://dev.to/feed/carlSagan'],
      github: {
        username: 'carlSagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
    await postUser(carlSagan);

    const putResponse = await putUser({ ...carlSagan, firstName: 'Nick' });

    expect(putResponse.status).toBe(200);

    const user = await getUser(carlSagan);
    const parsedUser = await user.json();

    expect(parsedUser).toEqual({ ...carlSagan, firstName: 'Nick' });
  });

  it('update a non-existing user', async () => {
    const nonExistingUser = {
      firstName: 'nobody',
      lastName: 'nobody',
      email: 'IdontExist@email.com',
      feeds: ['https://dev.to/feed/nobody'],
    };

    const putResponse = await putUser(nonExistingUser);

    expect(putResponse.status).toBe(404);
  });
});
