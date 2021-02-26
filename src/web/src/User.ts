import jwtDecode, { JwtPayload } from 'jwt-decode';

export default class User {
  // TODO: more user details...
  id: string;

  email: string;

  name: string;

  isAdmin: boolean;

  constructor(id: string, email: string, name: string, isAdmin: boolean) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.isAdmin = isAdmin;
  }

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
