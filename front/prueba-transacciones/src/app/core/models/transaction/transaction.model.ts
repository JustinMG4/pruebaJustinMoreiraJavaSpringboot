export enum TransactionType {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO'
}

export interface NewTransactionDto {
  type: TransactionType;
  amount: number;
}

export interface NewTransactionResponseDto {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  accountNumber: string;
  balanceAfterTransaction: number;
}

export interface TransactionDto {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  accountNumber: string;
}