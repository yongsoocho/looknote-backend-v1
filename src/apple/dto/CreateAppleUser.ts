export interface CreateAppleUserBody {
  code: string;
  name?: string;
  nickname: string;
  gender: gender;
  dateOfBirth: string;
  height?: string;
}

enum gender {
  ETC = 'ETC',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface CreateAppleUserPayload {
  email: string;
  name: string;
  nickname: string;
}

export interface decodedIdToken {
  // "https://appleid.apple.com"
  iss: string;
  // 'co.kr.looknote'
  aud: string;
  exp: number;
  iat: number;
  // '001949.936beb516a9347f8921ec9985663a98f.0557'
  sub: string;
  // 'dtYA8neQH6aDyQZKU0zfWA';
  c_hash: string;
  email: string;
  // 'true'
  email_verified: string;
  auth_time: number;
  // true
  nonce_supported: boolean;
}
