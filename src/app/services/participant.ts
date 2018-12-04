export interface Participant {
  firstName: string;
  lastName: string;
  email: string;
  passphrase: string;
  [propName:string]: any;
}
