import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CompanyListComponent } from './company/company-list.component';
import { UserListComponent } from './user/user-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

interface LoginResponse {
  email: string;
  companyId: number;
  isSuperAdmin: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App {
  public email = '';
  public password = '';
  public message = '';
  public isError = false;
  public isAuthenticated = false;

  public profileName = '';
  public profileEmail = '';

  constructor(private http: HttpClient, private auth: AuthService) {
    const user = this.auth.currentUser;
    if (user) {
      this.isAuthenticated = true;
      this.profileName = user.email;
      this.profileEmail = user.email;
      this.openDashboard();
    }
  }

  login() {
    this.message = '';
    this.isError = false;
    this.auth.login(this.email, this.password).subscribe({
      next: (r:any) => {
        this.message = 'Login successful. Welcome to Gram Panchayat Karyalay Management.';
        this.isAuthenticated = true;
        this.profileName = r.email;
        this.profileEmail = r.email;
        this.openDashboard();
      },
      error: () => {
        this.isError = true;
        this.message = 'Login failed. Please verify your credentials.';
      }
    });
  }

  showCompanies = false;
  showUsers = false;
  showDashboard = false;
  drawerOpen = true;
  profileMenuOpen = false;

  openCompanies() { this.showCompanies = true; this.showUsers = false; this.showDashboard = false; this.profileMenuOpen = false; }
  openUsers() { this.showUsers = true; this.showCompanies = false; this.showDashboard = false; this.profileMenuOpen = false; }
  openDashboard(){ this.showDashboard = true; this.showCompanies = false; this.showUsers = false; this.profileMenuOpen = false; }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.isAuthenticated = false;
    this.profileMenuOpen = false;
  }

  get sectionTitle() {
    if (this.showCompanies) return 'Company Master';
    if (this.showUsers) return 'User Management';
    return 'Dashboard Overview';
  }

  get sectionSubtitle() {
    if (this.showCompanies) return 'Manage Panchayat companies, supervisors, and office allocations.';
    if (this.showUsers) return 'Review and manage user access across the Gram Panchayat network.';
    return 'View active metrics and quick actions for your administration team.';
  }

  get profileInitials() {
    const email = this.profileEmail || this.email || 'Admin';
    return email.trim().charAt(0).toUpperCase();
  }

  protected readonly title = signal('GramApp');
}
