export enum AccountStatus {
  ACTIVA = 'ACTIVA',
  SUSPENDIDA = 'SUSPENDIDA',
  CERRADA = 'CERRADA'
}

export enum AccountType {
  AHORRO = 'AHORRO',
  CORRIENTE = 'CORRIENTE'
}

export interface AccountDto {
  id: string;
  accountNumber: string;
  balance: number;
  status: AccountStatus;
  type: AccountType;
  holderName: string;
}