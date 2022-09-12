export interface ICreateTokenMindBody {
  TokenType: string;
  AccessToken: string;
  User: UserMindBody;
}

export interface UserMindBody {
  Id: number;
  FirstName: string;
  LastName: string;
  Type: string;
}
