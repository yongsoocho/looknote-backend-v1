export interface PatchUserBody {
  gender?: Gender;
  nickname?: string;
  dateOfBirth?: string;
}

enum Gender {
  ETC = 'ETC',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
