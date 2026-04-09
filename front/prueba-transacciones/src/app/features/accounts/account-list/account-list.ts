import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { AccountDto, AccountStatus, AccountType } from '../../../core/models/account/account.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './account-list.html'
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);

  accounts = signal<AccountDto[]>([]);
  isLoading = signal<boolean>(true);

  // Filtros
  statusFilter = signal<AccountStatus>(AccountStatus.ACTIVA);
  typeFilter = signal<AccountType | null>(null);
  
  statusOptions = Object.values(AccountStatus);
  typeOptions = Object.values(AccountType);
  filteredAccountStatuses = [AccountStatus.ACTIVA, AccountStatus.SUSPENDIDA]; // Sin CERRADA

  // Control de UI
  activeDropdown = signal<string | null>(null);
  isAccStatusModalOpen = signal<boolean>(false);
  selectedAccount = signal<AccountDto | null>(null);
  tempAccStatus = signal<AccountStatus>(AccountStatus.ACTIVA);
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading.set(true);
    this.accountService.getAllAccountsByStatus(this.statusFilter(), this.typeFilter()).subscribe({
      next: (data: AccountDto[]) => {
        this.accounts.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error cargando cuentas', err);
        this.accounts.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange() {
    this.loadAccounts();
  }

  toggleDropdown(accountId: string) {
    this.activeDropdown.set(this.activeDropdown() === accountId ? null : accountId);
  }

  // --- ACCIONES DE ESTADO Y CIERRE ---
  openAccStatusModal(account: AccountDto) {
    this.selectedAccount.set(account);
    this.tempAccStatus.set(account.status);
    this.activeDropdown.set(null);
    this.isAccStatusModalOpen.set(true);
  }

  confirmAccStatusChange() {
    const acc = this.selectedAccount();
    if (!acc) return;

    this.isSubmitting.set(true);
    this.accountService.changeAccountStatus(acc.id, this.tempAccStatus()).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        this.isAccStatusModalOpen.set(false);
        Swal.fire({ icon: 'success', title: 'Estado Actualizado', text: 'La cuenta ha cambiado de estado.', confirmButtonColor: '#2563eb' });
        this.loadAccounts();
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Error al cambiar estado', confirmButtonColor: '#2563eb' });
      }
    });
  }

  onCloseAccount(account: AccountDto) {
    this.activeDropdown.set(null);
    Swal.fire({
      title: '¿Cerrar esta cuenta?',
      text: `La cuenta N° ${account.accountNumber} de ${account.holderName} pasará a estado CERRADA.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accountService.closeAccount(account.id).subscribe({
          next: (res: any) => {
            Swal.fire('Cuenta Cerrada', 'La cuenta ha sido dada de baja.', 'success');
            this.loadAccounts();
          },
          error: (err: any) => Swal.fire('Error', 'No se pudo cerrar la cuenta', 'error')
        });
      }
    });
  }
}