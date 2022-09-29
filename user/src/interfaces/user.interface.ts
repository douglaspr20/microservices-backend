export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthdate: string;
  mobilePhone: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  mindBodyToken?: string;
  mindBodyClientId?: string;
  cerboPatientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sub?: string;
}
