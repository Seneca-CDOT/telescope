export default {
  displayName: {
    name: 'displayName',
    label: 'Display Name',
    invalidErrorMsg: 'Make sure display name contains 2-16 characters',
  },
  firstName: {
    name: 'firstName',
    label: 'First name',
    requiredErrorMsg: 'First name is required',
    invalidErrorMsg: 'Make sure first name contains 2-16 characters',
  },
  lastName: {
    name: 'lastName',
    label: 'Last name',
    requiredErrorMsg: 'Last name is required',
    invalidErrorMsg: 'Make sure last name contains 2-16 characters',
  },
  email: {
    name: 'email',
    label: 'Email',
  },
  github: {
    name: 'github',
    label: 'Github Data`',
    invalidErrorMsg: 'Invalid GitHub profile',
  },
  githubUsername: {
    name: 'githubUsername',
    label: 'Github username',
    requiredErrorMsg: 'Github account is required',
  },
  githubOwnership: {
    name: 'githubOwnership',
    label: 'I declare I’m the owner and the maintainer of this GitHub account',
    invalidErrorMsg: 'You must be the owner of this account',
  },
  blogUrl: {
    name: 'blogUrl',
    label: 'Blog URl',
    requiredErrorMsg: 'Blog Url is required',
    invalidErrorMsg: 'Invalid URL',
  },
  feeds: {
    name: 'feeds',
    label: 'RSS Feeds',
    requiredErrorMsg: 'Please select at least one URL',
  },
  blogOwnership: {
    name: 'blogOwnership',
    label: 'I declare I’m the owner and the maintainer of this blog account',
    invalidErrorMsg: 'You must be the owner of this account',
  },
};
