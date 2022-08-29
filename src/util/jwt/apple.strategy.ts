import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(payload) {
    return {
      ...payload,
    };
  }
}
