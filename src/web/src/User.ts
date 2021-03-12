import jwtDecode, { JwtPayload } from 'jwt-decode';

export default class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public isAdmin: boolean
  ) {}

  // Will throw InvalidTokenError if accessToken can't be parsed
  static fromToken(token: string): User {
    const decoded: JwtPayload = jwtDecode(token);
    if (!decoded.sub) {
      throw new Error('invalid token');
    }
    // TODO: we need admin info...
    return new User('id', decoded.sub, 'Username', false);
  }
}
