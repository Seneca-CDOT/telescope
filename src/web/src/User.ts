import jwtDecode, { JwtPayload } from 'jwt-decode';

interface TelescopeJwtPayload extends JwtPayload {
  name: string;
  picture?: string;
  roles: Array<string>;
}

// Check if the expiry time in seconds is missing or has passed.
const isExpired = (exp?: number) => typeof exp === 'undefined' || new Date().getTime() / 1000 > exp;

export default class User {
  constructor(
    public email: string,
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
      decoded.name,
      decoded.roles.includes('telescope'),
      decoded.roles.includes('admin'),
      decoded.picture
    );
  }
}
