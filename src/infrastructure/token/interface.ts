export interface IToken {
  id: number;
  role: string;
  isActive: boolean;
  iat?: any;
  exp?: any;
}
