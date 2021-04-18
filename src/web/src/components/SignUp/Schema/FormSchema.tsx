import * as Yup from 'yup';

import formModels from './FormModel';

const {
  firstName,
  lastName,
  displayName,
  githubUsername,
  github,
  githubOwnership,
  feeds,
  allFeeds,
  blogUrl,
  blogOwnership,
} = formModels;

// Each signup step has one validation schema
export default [
  // First step we receive data from SSO.
  Yup.object().shape({}),

  Yup.object().shape({
    [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),
    [lastName.name]: Yup.string().required(`${lastName.requiredErrorMsg}`),
    [displayName.name]: Yup.string().required(`${displayName.requiredErrorMsg}`),
  }),

  // Second step we fetch data from GitHub.
  Yup.object().shape({
    [githubUsername.name]: Yup.string().required(`${githubUsername.requiredErrorMsg}`),
    [github.name]: Yup.object()
      .shape({
        username: Yup.string().required(),
        avatarUrl: Yup.string().url().required(),
      })
      .required(github.invalidErrorMsg),
    [githubOwnership.name]: Yup.boolean().test(
      'agreed',
      githubOwnership.invalidErrorMsg,
      (val) => !!val
    ),
  }),

  // Third step we collect the user blog and the RSSfeeds from it.
  Yup.object().shape({
    [blogUrl.name]: Yup.string().url().required(`${blogUrl.requiredErrorMsg}`),
    [feeds.name]: Yup.array().of(Yup.string()).min(1, feeds.requiredErrorMsg),
    [allFeeds.name]: Yup.array().of(Yup.string()),
    [blogOwnership.name]: Yup.boolean().test(
      'agreed',
      blogOwnership.invalidErrorMsg,
      (val) => !!val
    ),
  }),

  // Reviewing step has no validation logic. We just display all data that we collected.
  Yup.object().shape({}),
];
