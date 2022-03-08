let depsList = [];

module.exports = {
  __setMockDepList: (newDepsList) => {
    depsList = newDepsList;
  },
  getDependencyList: jest.fn().mockImplementation(() => {
    return Promise.resolve(depsList);
  }),
};
