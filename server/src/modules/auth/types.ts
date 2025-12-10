export type JwtPayload = {
  sub: string;
  email: string;
  fullName: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
