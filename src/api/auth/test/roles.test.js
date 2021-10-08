const roles = require('../src/roles');

describe('roles', () => {
  it('should return correct roles for Seneca user', () => {
    expect(roles.seneca()).toEqual(['seneca']);
  });

  it('should return correct roles for Telescope user', () => {
    expect(roles.telescope()).toEqual(['seneca', 'telescope']);
  });

  it('should return correct roles for Admin user', () => {
    expect(roles.admin()).toEqual(['seneca', 'telescope', 'admin']);
  });

  it('should return correct roles for a Super user', () => {
    expect(roles.superUser()).toEqual(['seneca', 'admin']);
  });
});
