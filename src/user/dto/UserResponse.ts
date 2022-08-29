export interface DataBaseUser {
  id: number;
  email: string;
  name: string;
  nickname: string;
  password: string;
  agree?: boolean;
  dateOfBirth?: string;
  gender: Gender;
  height?: string;
  profile?: string;
  provider: Provider;
  weight?: string;
  snsId?: string;
  admin?: boolean;
  deletedAt?: string;
  createdAt: string;
  point: number;
  pointSum: number;
  status: Status;
  reason?: null;
}

export interface DefaultUserResponse {
  id: number;
  email: string;
  name: string;
  nickname: string;
  agree?: boolean;
  dateOfBirth: string;
  gender: Gender;
  height?: string;
  profile?: string;
  provider: Provider;
  snsId?: string;
  weight?: string;
  admin?: boolean;
  createdAt: string;
  point: number;
  pointSum: number;
}

enum Provider {
  LOCAL = 'LOCAL',
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

enum Gender {
  ETC = 'ETC',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum Status {
  DELETE = 'DELETE',
  ACTIVE = 'ACTIVE',
}
