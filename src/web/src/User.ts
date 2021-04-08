/* eslint-disable camelcase */
import jwtDecode, { JwtPayload } from 'jwt-decode';

interface TelescopeJwtPayload extends JwtPayload {
  email: string;
  given_name: string;
  family_name: string;
  name: string;
  picture?: string;
  roles: Array<string>;
}

// Check if the expiry time in seconds is missing or has passed.
const isExpired = (exp?: number) => typeof exp === 'undefined' || new Date().getTime() / 1000 > exp;

export default class User {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public name: string,
    // If the user has a Telescope account
    public isRegistered: boolean,
    // If the user is a Telescope admin
    public isAdmin: boolean,
    // Not every user has a picture (only registered Telescope users)
    public avatarUrl?: string
  ) {}

  // Will throw InvalidTokenError if accessToken can't be parsed
  static fromToken(token: string): User {
    // Decode to get payload
    const decoded: TelescopeJwtPayload = jwtDecode(token);
    if (!decoded.sub) {
      throw new Error('invalid token');
    }

    // Make sure it hasn't expired
    if (isExpired(decoded.exp)) {
      throw new Error('token expired');
    }

    // Otherwise, return a new User based on this data
    return new User(
      decoded.sub,
      decoded.email,
      decoded.given_name,
      decoded.family_name,
      decoded.name,
      decoded.roles.includes('telescope'),
      decoded.roles.includes('admin'),
      decoded.picture
    );
  }
}
