import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  showForm = false;
  editingUser: any = null;
  errorMsg = '';

  form = { nombre: '', email: '', password: '', rol: 'familiar' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: () => (this.errorMsg = 'Error al cargar usuarios'),
    });
  }

  openCreate(): void {
    this.editingUser = null;
    this.form = { nombre: '', email: '', password: '', rol: 'familiar' };
    this.errorMsg = '';
    this.showForm = true;
  }

  openEdit(user: any): void {
    this.editingUser = user;
    this.form = { nombre: user.nombre, email: user.email, password: '', rol: user.rol };
    this.errorMsg = '';
    this.showForm = true;
  }

  save(): void {
    const data: any = { ...this.form };
    if (!data.password) delete data.password;

    const request = this.editingUser
      ? this.adminService.updateUser(this.editingUser.id, data)
      : this.adminService.createUser(data);

    request.subscribe({
      next: () => {
        this.showForm = false;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al guardar usuario';
      },
    });
  }

  delete(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => (this.errorMsg = 'Error al eliminar usuario'),
    });
  }
}