import { string, array, object } from 'yup';

import formModels from './FormModel';

const DiscoveredFeed = object().shape({
  feedUrl: string().required(),
  type: string().required(),
});

const {
  firstName,
  lastName,
  displayName,
  githubUsername,
  github,
  blogs,
  allBlogs,
  channels,
  allChannels,
  blogUrl,
  channelUrl,
} = formModels;

// Each signup step has one validation schema
export default [
  // First step we receive data from SSO.
  object().shape({}),

  object().shape({
    [firstName.name]: string().required(firstName.requiredErrorMsg),
    [lastName.name]: string().required(lastName.requiredErrorMsg),
    [displayName.name]: string().required(displayName.requiredErrorMsg),
  }),

  // Second step we fetch data from GitHub.
  object().shape({
    [githubUsername.name]: string().required(githubUsername.requiredErrorMsg),
    [github.name]: object()
      .shape({
        username: string().required(),
        avatarUrl: string().url().required(),
      })
      .required(github.invalidErrorMsg),
  }),

  // Third step we collect the user blog and the RSSfeeds from it.
  object().shape({
    [blogUrl.name]: string(),
    [blogs.name]: array().of(DiscoveredFeed).min(1, blogs.requiredErrorMsg),
    [allBlogs.name]: array().of(DiscoveredFeed),
  }),

  // Fourth step we collect the user YouTube/Twitch channels and the RSSfeeds from it.
  object().shape({
    [channelUrl.name]: string(),
    [channels.name]: array().of(DiscoveredFeed),
    [allChannels.name]: array().of(DiscoveredFeed),
  }),

  // Reviewing step has no validation logic. We just display all data that we collected.
  object().shape({}),
];
