import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client';
import { ClientDto, ClientStatus, RegisterClientDto, UpdateClientDto } from '../../../core/models/client.model';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import { RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule], // FormsModule y ReactiveFormsModule necesarios para el input buscar
  templateUrl: './client-list.html',
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  clients = signal<ClientDto[]>([]);
  isLoading = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  currentStatus = signal<ClientStatus>(ClientStatus.ACTIVE);
  searchTerm = signal<string>('');
  activeDropdown = signal<string | null>(null);
  editingClientId = signal<string | null>(null);
  isStatusModalOpen = signal<boolean>(false);
  selectedClient = signal<ClientDto | null>(null);
  newStatus = signal<ClientStatus>(ClientStatus.ACTIVE);

  statusOptions = Object.values(ClientStatus);

  filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.clients().filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.identificationNumber.includes(term)
    );
  });

  clientForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: [18, [Validators.required, Validators.min(1)]],
    isMale: [true, Validators.required],
    identificationNumber: ['', [Validators.required]],
    direction: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  // Funciones para el Modal
  openModal(client?: ClientDto) {
    if (client) {
      // MODO EDICIÓN
      this.editingClientId.set(client.id);
      this.clientForm.patchValue({
        name: client.name,
        age: client.age,
        isMale: client.isMale,
        identificationNumber: client.identificationNumber,
        direction: client.direction,
        phoneNumber: client.phoneNumber
      });
      this.clientForm.get('password')?.clearValidators();
      this.clientForm.get('password')?.updateValueAndValidity();
    } else {
      // MODO CREACIÓN
      this.editingClientId.set(null);
      this.clientForm.reset({ age: 18, isMale: true });
      // Volvemos a hacer obligatoria la contraseña
      this.clientForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.clientForm.get('password')?.updateValueAndValidity();
    }

    this.activeDropdown.set(null);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // Función para guardar
  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.clientForm.getRawValue();
    formValue.isMale = String(formValue.isMale) === 'true';

    const currentEditId = this.editingClientId();

    if (currentEditId) {
      // LLAMADA A UPDATE
      const updateDto: UpdateClientDto = {
        name: formValue.name,
        age: Number(formValue.age),
        isMale: formValue.isMale,
        identificationNumber: formValue.identificationNumber,
        direction: formValue.direction,
        phoneNumber: formValue.phoneNumber
      };

      this.clientService.updateClient(currentEditId, updateDto).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: response.message || 'El cliente se actualizó correctamente.',
            confirmButtonColor: '#2563eb'
          });
          this.loadClients();
        },
        error: (err: any) => {
          this.isSubmitting.set(false);
          Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Error al actualizar', confirmButtonColor: '#2563eb' });
        }
      });
    } else {
      // LLAMADA A CREATE
      const registerDto = formValue as RegisterClientDto;
      this.clientService.createClient(registerDto).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.closeModal();
          Swal.fire({ icon: 'success', title: '¡Registrado!', text: `Cliente guardado.`, confirmButtonColor: '#2563eb' });
          this.loadClients();
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Error', confirmButtonColor: '#2563eb' });
        }
      });
    }
  }

  toggleDropdown(clientId: string) {
    if (this.activeDropdown() === clientId) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(clientId);
    }
  }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading.set(true);
    this.clientService.getAllClients(this.currentStatus()).subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.isLoading.set(false);
      }
    });
  }

  onStatusChange(newStatus: string) {
    this.currentStatus.set(newStatus as ClientStatus);
    this.loadClients();
  }

  openStatusModal(client: ClientDto) {
    this.selectedClient.set(client);
    this.newStatus.set(client.status);
    this.activeDropdown.set(null);
    this.isStatusModalOpen.set(true);
  }

  // 3. Función para consumir el endpoint
  onConfirmStatusChange() {
    const client = this.selectedClient();
    if (!client) return;

    this.isSubmitting.set(true);
    this.clientService.changeStatus(client.id, this.newStatus()).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.isStatusModalOpen.set(false);
        Swal.fire({
          icon: 'success',
          title: 'Estado Actualizado',
          text: res.message || `El cliente ahora está ${this.newStatus()}`,
          confirmButtonColor: '#2563eb'
        });
        this.loadClients(); 
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo cambiar el estado',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }
  onDeleteClient(client: ClientDto) {
    this.activeDropdown.set(null);

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al cliente ${client.name}. Esta acción no siempre se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const params = new HttpParams().set('id', client.id);
        this.http.patch(`${environment.apiUrl}/clients/delete`, {}, { params }).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
            this.loadClients();
          },
          error: (err: any) => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }
}
