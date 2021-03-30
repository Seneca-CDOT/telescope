const { hash } = require('@senecacdot/satellite');

const User = require('../src/user');

const createSenecaProfile = (overrides = {}) => ({
  issuer: 'https://sts.windows.net/...',
  inResponseTo: '_851650d2472d2921c6ac',
  sessionIndex: '_dfa0c21c-b4d6-43cb-a277-2cf456d43600',
  nameID: 'first.last@senecacollege.ca',
  nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  'http://schemas.microsoft.com/identity/claims/tenantid': '3dd...',
  'http://schemas.microsoft.com/identity/claims/objectidentifier':
    '4b4a05ff-04a4-49d9-91b8-1f92d2077f80',
  'http://schemas.microsoft.com/identity/claims/displayname': 'Seneca Display Name',
  'http://schemas.microsoft.com/identity/claims/identityprovider': 'https://sts...',
  'http://schemas.microsoft.com/claims/authnmethodsreferences':
    'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'First',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'Last',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
    'first.last@senecacollege.ca',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'first.last@senecacollege.ca',
  ...overrides,
});

const createTelescopeProfile = (overrides = {}) => ({
  firstName: 'First',
  lastName: 'Last',
  displayName: 'Telescope Display Name',
  isAdmin: true,
  isFlagged: true,
  feeds: ['https://dev.to/feed/first-last'],
  github: {
    username: 'firstlast',
    avatarUrl:
      'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
  },
  ...overrides,
});

describe('User()', () => {
  describe('All users', () => {
    it('should have an id property that returns the hashed email in the form we expect', () => {
      const email = 'first.last@senecacollege.ca';
      const user = new User(createSenecaProfile({ email }));
      const expectedId = hash(email);
      expect(user.id).toEqual(expectedId);
    });

    it('should have an email property', () => {
      const user = new User(createSenecaProfile({ email: 'first.last@senecacollege.ca' }));
      expect(user.email).toEqual('first.last@senecacollege.ca');
    });

    it('should have a nameID property', () => {
      const user = new User(createSenecaProfile({ nameID: 'first.last@senecacollege.ca' }));
      expect(user.nameID).toEqual('first.last@senecacollege.ca');
    });

    it('should have a nameIDFormat property', () => {
      const user = new User(
        createSenecaProfile({
          nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        })
      );
      expect(user.nameIDFormat).toEqual('urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress');
    });

    it('should not have a firstName property', () => {
      const user = new User(createSenecaProfile());
      expect(user.firstName).toBe(undefined);
    });

    it('should not have a lastName property', () => {
      const user = new User(createSenecaProfile());
      expect(user.lastName).toBe(undefined);
    });

    it('should have isAdmin false', () => {
      const user = new User(createSenecaProfile());
      expect(user.isAdmin).toBe(false);
    });

    it('should have isFlagged false', () => {
      const user = new User(createSenecaProfile());
      expect(user.isFlagged).toBe(false);
    });

    it('should have displayName property', () => {
      const user = new User(
        createSenecaProfile({
          'http://schemas.microsoft.com/identity/claims/displayname': 'display name',
        })
      );
      expect(user.displayName).toBe('display name');
    });

    it('should have the "seneca" role', () => {
      const user = new User(createSenecaProfile());
      expect(user.roles).toEqual(['seneca']);
    });

    it('should include expected data in serialized JSON', () => {
      const profile = createSenecaProfile();
      const user = new User(profile);
      const json = JSON.stringify(user);
      const deserialized = JSON.parse(json);
      expect(deserialized.seneca).toEqual({
        'http://schemas.microsoft.com/identity/claims/displayname':
          profile['http://schemas.microsoft.com/identity/claims/displayname'],
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
          profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        nameID: profile.nameID,
        nameIDFormat: profile.nameIDFormat,
      });
    });

    it('should parse a serialized user back into a full object', () => {
      const senecaProfile = createSenecaProfile();
      const user = new User(senecaProfile);
      const json = JSON.stringify(user);
      const parsed = JSON.parse(json);
      const user2 = User.parse(parsed);
      expect(user2.email).toEqual('first.last@senecacollege.ca');
      expect(user2.nameID).toEqual('first.last@senecacollege.ca');
      expect(user2.nameIDFormat).toEqual('urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress');
      expect(user2.firstName).toBe(undefined);
      expect(user2.lastName).toBe(undefined);
      expect(user2.displayName).toEqual('Seneca Display Name');
      expect(user2.isAdmin).toBe(false);
      expect(user2.isFlagged).toBe(false);
      expect(user2.feeds).toBe(undefined);
      expect(user2.github).toBe(undefined);
      expect(user2.isTelescopeUser).toBe(false);
      expect(user2.roles).toEqual(['seneca']);
    });
  });

  describe('Telescope users', () => {
    it('should have isTelescopeUser be true', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile());
      expect(user.isTelescopeUser).toBe(true);
    });

    it('should have a firstName property', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ firstName: 'first' }));
      expect(user.firstName).toEqual('first');
    });

    it('should have a lastName property', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ lastName: 'last' }));
      expect(user.lastName).toEqual('last');
    });

    it('should have isAdmin property', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ isAdmin: true }));
      expect(user.isAdmin).toBe(true);
    });

    it('should respect isAdmin value', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ isAdmin: false }));
      expect(user.isAdmin).toBe(false);
    });

    it('should have isFlagged property', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ isFlagged: true }));
      expect(user.isFlagged).toBe(true);
    });

    it('should respect isFlagged value', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ isFlagged: false }));
      expect(user.isFlagged).toBe(false);
    });

    it('should prefer the Telescope display name when available', () => {
      const user = new User(
        createSenecaProfile({
          'http://schemas.microsoft.com/identity/claims/displayname': 'seneca',
        }),
        createTelescopeProfile({ displayName: 'telescope' })
      );
      expect(user.displayName).toBe('telescope');
    });

    it('should have feeds property', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ feeds: ['a', 'b'] }));
      expect(user.feeds).toEqual(['a', 'b']);
    });

    it('should have github property', () => {
      const user = new User(
        createSenecaProfile(),
        createTelescopeProfile({ github: { username: 'username', avatarUrl: 'avatarUrl' } })
      );
      expect(user.github).toEqual({ username: 'username', avatarUrl: 'avatarUrl' });
    });

    it('should have an avatarUrl property if GitHub info is defined', () => {
      const userWithGitHub = new User(
        createSenecaProfile(),
        createTelescopeProfile({ github: { username: 'username', avatarUrl: 'avatarUrl' } })
      );
      expect(userWithGitHub.avatarUrl).toEqual('avatarUrl');

      const userWithoutGitHub = new User(createSenecaProfile());
      expect(userWithoutGitHub.avatarUrl).toBe(undefined);
    });

    it('should have the "seneca" and "telescope" roles', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ isAdmin: false }));
      expect(user.roles).toEqual(['seneca', 'telescope']);
    });

    it('should have the "seneca", "telescope", and "admin" roles', () => {
      const user = new User(createSenecaProfile(), createTelescopeProfile({ isAdmin: true }));
      expect(user.roles).toEqual(['seneca', 'telescope', 'admin']);
    });

    it('should include expected data in serialized JSON', () => {
      const senecaProfile = createSenecaProfile();
      const telescopeProfile = createTelescopeProfile();
      const user = new User(senecaProfile, telescopeProfile);
      const json = JSON.stringify(user);
      const deserialized = JSON.parse(json);
      expect(deserialized.seneca).toEqual({
        'http://schemas.microsoft.com/identity/claims/displayname':
          senecaProfile['http://schemas.microsoft.com/identity/claims/displayname'],
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
          senecaProfile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        nameID: senecaProfile.nameID,
        nameIDFormat: senecaProfile.nameIDFormat,
      });
      expect(deserialized.telescope).toEqual(telescopeProfile);
    });

    it('should parse a serialized user back into a full object', () => {
      const senecaProfile = createSenecaProfile();
      const telescopeProfile = createTelescopeProfile();
      const user = new User(senecaProfile, telescopeProfile);
      const json = JSON.stringify(user);
      const parsed = JSON.parse(json);
      const user2 = User.parse(parsed);
      expect(user2.email).toEqual('first.last@senecacollege.ca');
      expect(user2.nameID).toEqual('first.last@senecacollege.ca');
      expect(user2.nameIDFormat).toEqual('urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress');
      expect(user2.firstName).toEqual('First');
      expect(user2.lastName).toEqual('Last');
      expect(user2.displayName).toEqual('Telescope Display Name');
      expect(user2.isAdmin).toBe(true);
      expect(user2.isFlagged).toBe(true);
      expect(user2.feeds).toEqual(['https://dev.to/feed/first-last']);
      expect(user2.github).toEqual({
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
        username: 'firstlast',
      });
      expect(user2.isTelescopeUser).toBe(true);
      expect(user2.roles).toEqual(['seneca', 'telescope', 'admin']);
    });
  });
});
