import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account/account.service';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { AccountDto } from '../../../core/models/account/account.model';
import { TransactionDto } from '../../../core/models/transaction/transaction.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-statement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-statement.html'
})
export class AccountStatementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);

  accountId = signal<string>('');
  account = signal<AccountDto | null>(null);
  transactions = signal<TransactionDto[]>([]);
  
  isLoadingAccount = signal<boolean>(true);
  isLoadingTransactions = signal<boolean>(true);


  today = new Date().toISOString().split('T')[0];
  startDate = signal<string>(this.today);
  endDate = signal<string>(this.today);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accountId.set(id);
      this.loadAccountDetails();
      this.loadTransactions();
    }
  }

  goBack() {
    this.location.back();
  }

  loadAccountDetails() {
    this.isLoadingAccount.set(true);
    this.accountService.getAccountById(this.accountId()).subscribe({
      next: (data: AccountDto) => {
        this.account.set(data);
        this.isLoadingAccount.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar la cuenta', err);
        this.isLoadingAccount.set(false);
      }
    });
  }

  loadTransactions() {
    this.isLoadingTransactions.set(true);
    this.transactionService.getAllTransactions(this.accountId(), this.startDate(), this.endDate()).subscribe({
      next: (data: TransactionDto[]) => {
        this.transactions.set(data);
        this.isLoadingTransactions.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar transacciones', err);
        this.transactions.set([]);
        this.isLoadingTransactions.set(false);
      }
    });
  }

  onDateChange() {
    if (this.startDate() && this.endDate() && this.startDate() > this.endDate()) {
      return; 
    }
    this.loadTransactions();
  }
}