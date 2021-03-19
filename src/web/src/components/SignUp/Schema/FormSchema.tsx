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
  blogUrl,
  blogOwnership,
} = formModels;

const validateLength = (min: number, max: number) => (val: string | undefined): boolean =>
  !!val && val.length >= min && val.length <= max;

const validateCheckBox = (val: boolean | undefined) => !!val;

// Each signup step has one validation schema
export default [
  // First step has no validation logic
  Yup.object().shape({}),

  Yup.object().shape({
    [firstName.name]: Yup.string()
      .required(`${firstName.requiredErrorMsg}`)
      .test('len', firstName.invalidErrorMsg, validateLength(2, 16)),
    [lastName.name]: Yup.string()
      .required(`${lastName.requiredErrorMsg}`)
      .test('len', lastName.invalidErrorMsg, validateLength(2, 16)),
    [displayName.name]: Yup.string().test(
      'len',
      displayName.invalidErrorMsg,
      validateLength(2, 16)
    ),
  }),

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
      validateCheckBox
    ),
  }),

  Yup.object().shape({
    [blogUrl.name]: Yup.string().url().required(`${blogUrl.requiredErrorMsg}`),
    [feeds.name]: Yup.array().of(Yup.string()).min(1, feeds.requiredErrorMsg),
    [blogOwnership.name]: Yup.boolean().test(
      'agreed',
      blogOwnership.invalidErrorMsg,
      validateCheckBox
    ),
  }),

  // Reviewing step has no validation logic
  Yup.object().shape({}),
];
