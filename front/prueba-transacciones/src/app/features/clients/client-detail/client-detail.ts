import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client';
import { AccountService } from '../../../core/services/account/account.service';
import { ClientDto } from '../../../core/models/client.model';
import { AccountDto, AccountStatus, AccountType } from '../../../core/models/account/account.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateClientDto } from '../../../core/models/client.model';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { TransactionType } from '../../../core/models/transaction/transaction.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-detail.html'
})
export class ClientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private clientService = inject(ClientService);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  // Estados
  clientId = signal<string>('');
  client = signal<ClientDto | null>(null);
  accounts = signal<AccountDto[]>([]);
  isLoadingProfile = signal<boolean>(true);
  isLoadingAccounts = signal<boolean>(false);
  isEditModalOpen = signal<boolean>(false);
  isSubmittingEdit = signal<boolean>(false);
  isStatusModalOpen = signal<boolean>(false);
  tempStatus = signal<AccountStatus | any>(null);
  isCreateAccountModalOpen = signal<boolean>(false);
  newAccountType = signal<AccountType>(AccountType.AHORRO);
  isSubmittingAccount = signal<boolean>(false);
  isAccStatusModalOpen = signal<boolean>(false);
  selectedAccount = signal<AccountDto | null>(null);
  tempAccStatus = signal<AccountStatus>(AccountStatus.ACTIVA);
  accountStatusFilter = signal<AccountStatus>(AccountStatus.ACTIVA);
  accountTypeFilter = signal<AccountType | null>(null);
  activeDropdown = signal<string | null>(null);
  isTransactionModalOpen = signal<boolean>(false);
  isSubmittingTransaction = signal<boolean>(false);
  transactionAccount = signal<AccountDto | null>(null);

  filteredAccountStatuses = [AccountStatus.ACTIVA, AccountStatus.SUSPENDIDA];


  statusOptions = Object.values(AccountStatus);
  typeOptions = Object.values(AccountType);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId.set(id);
      this.loadClientProfile();
      this.loadClientAccounts();
    }
  }

  transactionForm = this.fb.nonNullable.group({
    type: [TransactionType.CREDITO, Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    password: ['', Validators.required]
  });

  transactionTypes = Object.values(TransactionType);

  goBack() {
    this.location.back();
  }

  loadClientProfile() {
    this.isLoadingProfile.set(true);
    this.clientService.getClientById(this.clientId()).subscribe({
      next: (data: ClientDto) => {
        this.client.set(data);
        this.isLoadingProfile.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando perfil', err);
        this.isLoadingProfile.set(false);
      }
    });
  }

  loadClientAccounts() {
    this.isLoadingAccounts.set(true);
    this.accountService.getAccountsByClientAndStatus(
      this.clientId(),
      this.accountStatusFilter(),
      this.accountTypeFilter()
    ).subscribe({
      next: (data: AccountDto[]) => {
        this.accounts.set(data);
        this.isLoadingAccounts.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando cuentas', err);
        this.accounts.set([]);
        this.isLoadingAccounts.set(false);
      }
    });
  }

  onFilterChange() {
    this.loadClientAccounts();
  }
  toggleDropdown(accountId: string) {
    if (this.activeDropdown() === accountId) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(accountId);
    }
  }


  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: [18, [Validators.required, Validators.min(1)]],
    isMale: [true, Validators.required],
    identificationNumber: ['', [Validators.required]],
    direction: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  openEditModal() {
    const current = this.client();
    if (current) {
      this.editForm.patchValue({
        name: current.name,
        age: current.age,
        isMale: current.isMale,
        identificationNumber: current.identificationNumber,
        direction: current.direction,
        phoneNumber: current.phoneNumber
      });
      this.isEditModalOpen.set(true);
    }
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
  }

  submitEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmittingEdit.set(true);
    const formValue = this.editForm.getRawValue();
    formValue.isMale = String(formValue.isMale) === 'true';

    this.clientService.updateClient(this.clientId(), formValue as UpdateClientDto).subscribe({
      next: (res) => {
        this.isSubmittingEdit.set(false);
        this.closeEditModal();
        Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Perfil actualizado correctamente', confirmButtonColor: '#2563eb' });
        this.loadClientProfile();
      },
      error: (err: any) => {
        this.isSubmittingEdit.set(false);
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Error al actualizar', confirmButtonColor: '#2563eb' });
      }
    });
  }

  openStatusModal() {
    if (this.client()) {
      this.tempStatus.set(this.client()!.status);
      this.isStatusModalOpen.set(true);
    }
  }

  confirmStatusChange() {
    this.isSubmittingEdit.set(true);
    this.clientService.changeStatus(this.clientId(), this.tempStatus()).subscribe({
      next: (res) => {
        this.isSubmittingEdit.set(false);
        this.isStatusModalOpen.set(false);
        Swal.fire({ icon: 'success', title: 'Éxito', text: 'Estado del cliente actualizado', confirmButtonColor: '#2563eb' });
        this.loadClientProfile();
      },
      error: (err: any) => {
        this.isSubmittingEdit.set(false);
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Error', confirmButtonColor: '#2563eb' });
      }
    });
  }

  openCreateAccountModal() {
    this.newAccountType.set(AccountType.AHORRO);
    this.isCreateAccountModalOpen.set(true);
  }

  confirmCreateAccount() {
    this.isSubmittingAccount.set(true);

    this.accountService.createAccount(this.clientId(), this.newAccountType()).subscribe({
      next: (res: AccountDto) => {
        this.isSubmittingAccount.set(false);
        this.isCreateAccountModalOpen.set(false);

        Swal.fire({
          icon: 'success',
          title: '¡Cuenta Creada con Éxito!',
          html: `<span class="font-semibold">${res.holderName}</span>, tu cuenta del tipo <span class="font-semibold text-blue-600">${res.type}</span> ha sido creada.<br><br>Tu número de cuenta es:<br><span class="text-2xl font-mono text-gray-800 tracking-wider mt-2 block">${res.accountNumber}</span>`,
          confirmButtonColor: '#2563eb'
        });
        this.loadClientAccounts();
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmittingAccount.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Hubo un problema al crear la cuenta',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  openAccStatusModal(account: AccountDto) {
  this.selectedAccount.set(account);
  this.tempAccStatus.set(account.status);
  this.activeDropdown.set(null);
  this.isAccStatusModalOpen.set(true);
}

confirmAccStatusChange() {
  const acc = this.selectedAccount();
  if (!acc) return;

  this.isSubmittingAccount.set(true);
  this.accountService.changeAccountStatus(acc.id, this.tempAccStatus()).subscribe({
    next: (res: any) => {
      this.isSubmittingAccount.set(false);
      this.isAccStatusModalOpen.set(false);
      Swal.fire({
        icon: 'success',
        title: 'Estado Actualizado',
        text: res.message || 'La cuenta ha cambiado de estado.',
        confirmButtonColor: '#2563eb'
      });
      this.loadClientAccounts();
    },
    error: (err: any) => {
      this.isSubmittingAccount.set(false);
      Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Error al cambiar estado' });
    }
  });
}

onCloseAccount(account: AccountDto) {
  this.activeDropdown.set(null);
  
  Swal.fire({
    title: '¿Cerrar esta cuenta?',
    text: `La cuenta N° ${account.accountNumber} pasará a estado CERRADA. Esta acción no se puede revertir.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, cerrar cuenta',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.accountService.closeAccount(account.id).subscribe({
        next: (res: any) => {
          Swal.fire('Cuenta Cerrada', res.message, 'success');
          this.loadClientAccounts();
        },
        error: (err: any) => {
          Swal.fire('Error', err.error?.message || 'No se pudo cerrar la cuenta', 'error');
        }
      });
    }
  });
}
openTransactionModal(account: AccountDto) {
    this.transactionAccount.set(account);
    this.transactionForm.reset({ type: TransactionType.CREDITO, amount: 0, password: '' });
    this.activeDropdown.set(null);
    this.isTransactionModalOpen.set(true);
  }

  submitTransaction() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formValues = this.transactionForm.getRawValue();
    const account = this.transactionAccount();
    if (!account) return;

    this.isSubmittingTransaction.set(true);

    // PASO 1: Verificar Contraseña
    this.clientService.verifyPassword(this.clientId(), formValues.password).subscribe({
      next: (isValid: boolean) => {
        if (!isValid) {
          this.isSubmittingTransaction.set(false);
          Swal.fire({ 
            icon: 'error', 
            title: 'Autenticación Fallida', 
            text: 'La contraseña ingresada es incorrecta.', 
            confirmButtonColor: '#2563eb' 
          });
          return; 
        }
        
        // PASO 2: Si la contraseña es correcta, procesar transacción
        const newTx = { type: formValues.type, amount: formValues.amount };
        
        this.transactionService.createTransaction(account.id, newTx).subscribe({
          next: (res) => {
            this.isSubmittingTransaction.set(false);
            this.isTransactionModalOpen.set(false);
            
            Swal.fire({
              icon: 'success',
              title: '¡Transacción Exitosa!',
              html: `
                <div class="text-left space-y-2 mt-4 text-sm text-gray-700">
                  <p><strong>N° Cuenta:</strong> ${res.accountNumber}</p>
                  <p><strong>Tipo:</strong> <span class="${res.type === 'CREDITO' ? 'text-green-600' : 'text-red-600'} font-bold">${res.type}</span></p>
                  <p><strong>Monto:</strong> $${res.amount.toFixed(2)}</p>
                  <p><strong>Fecha:</strong> ${res.date}</p>
                  <hr class="my-2">
                  <p class="text-lg font-bold text-gray-900">Nuevo Saldo: <span class="text-blue-600">$${res.balanceAfterTransaction.toFixed(2)}</span></p>
                  <p class="text-xs text-gray-400 mt-2">Ref ID: ${res.id}</p>
                </div>
              `,
              confirmButtonColor: '#2563eb'
            });

            this.loadClientAccounts();
          },
          error: (err: HttpErrorResponse) => {
            this.isSubmittingTransaction.set(false);
            Swal.fire({ icon: 'error', title: 'Transacción Rechazada', text: err.error?.message || 'Error en la operación financiera', confirmButtonColor: '#2563eb' });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmittingTransaction.set(false);
        Swal.fire({ icon: 'error', title: 'Autenticación Fallida', text: err.error?.message || 'La contraseña ingresada es incorrecta.', confirmButtonColor: '#2563eb' });
      }
    });
  }


}