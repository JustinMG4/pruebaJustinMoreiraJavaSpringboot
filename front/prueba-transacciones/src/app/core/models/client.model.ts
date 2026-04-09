export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface ClientDto {
  id: string;
  name: string;
  age: number;
  isMale: boolean;
  identificationNumber: string;
  direction: string;
  phoneNumber: string;
  status: ClientStatus;
}


export interface RegisterClientDto {
  name: string;
  age: number;
  isMale: boolean;
  identificationNumber: string;
  direction: string;
  phoneNumber: string;
  password: string;
}

export interface UpdateClientDto {
  name: string;
  age: number;
  isMale: boolean;
  identificationNumber: string;
  direction: string;
  phoneNumber: string;
}