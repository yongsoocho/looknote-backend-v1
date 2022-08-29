export interface FilterBody {
  ct_ct_001?: string;
  ct_ct_002?: string;
  ct_ct_003?: string;
  // string '필터1,필터2,필터3' 띄어쓰기 없이 가능
  // Array<string> ['필터1','필터2','필터3'] 가능
  details?: string | object;
}

export interface FilterWithAuthorIdBody {
  ct_ct_001?: string;
  ct_ct_002?: string;
  ct_ct_003?: string;
  // string '필터1,필터2,필터3' 띄어쓰기 없이 가능
  // Array<string> ['필터1','필터2','필터3'] 가능
  details?: string | object;
  authorId: string | number;
}

export type DetailsPipeType = Array<string>;
