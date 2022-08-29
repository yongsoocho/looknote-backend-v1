import * as dotenv from 'dotenv';
dotenv.config();

export const jwtOption = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: `${60 * 60}s`,
  },
};
