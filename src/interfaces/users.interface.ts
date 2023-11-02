export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface IEmail {
  email: string;
}

export interface IAuth {
  email: string;
  password: string;
}

export interface IPagination {
  pageNumber: number;
  pageSize: number;
}
