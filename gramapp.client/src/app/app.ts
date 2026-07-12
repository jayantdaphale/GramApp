import { HttpClient } from '@angular/common/http';
import { Component, HostListener, signal } from '@angular/core';
import { AuthService, NavigationMenu } from './services/auth.service';

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
  public menus: NavigationMenu[] = [];
  public activeMenuCode = '';

  constructor(private http: HttpClient, private auth: AuthService) {
    const user = this.auth.currentUser;
    if (user) {
      this.isAuthenticated = true;
      this.profileName = user.email;
      this.profileEmail = user.email;
      this.menus = user.menus ?? [];
      this.selectInitialMenu();
      this.auth.loadCurrentMenus().subscribe({
        next: menus => { this.menus = menus; this.ensureActiveMenu(); },
        error: () => { if (!this.auth.isAuthenticated()) this.isAuthenticated = false; }
      });
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
        this.menus = r.menus ?? [];
        this.selectInitialMenu();
      },
      error: () => {
        this.isError = true;
        this.message = 'Login failed. Please verify your credentials.';
      }
    });
  }

  private isMobileView = window.matchMedia('(max-width: 820px)').matches;
  drawerOpen = !this.isMobileView;
  profileMenuOpen = false;

  openMenu(code: string) { this.activeMenuCode = code; this.finishNavigation(); }

  get groupedMenus(): { name: string; menus: NavigationMenu[] }[] {
    const groups = new Map<string, NavigationMenu[]>();
    this.menus.forEach(menu => groups.set(menu.menuGroupName, [...(groups.get(menu.menuGroupName) ?? []), menu]));
    return [...groups].map(([name, menus]) => ({ name, menus }));
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeDrawer();
    this.profileMenuOpen = false;
  }

  @HostListener('window:resize')
  handleResize() {
    const isMobile = window.matchMedia('(max-width: 820px)').matches;
    if (isMobile && !this.isMobileView) {
      this.closeDrawer();
    }
    this.isMobileView = isMobile;
  }

  private finishNavigation() {
    this.profileMenuOpen = false;
    if (this.isMobileView) {
      this.closeDrawer();
    }
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.isAuthenticated = false;
    this.menus = [];
    this.activeMenuCode = '';
    this.profileMenuOpen = false;
  }

  get sectionTitle() {
    return this.menus.find(x => x.code === this.activeMenuCode)?.name ?? 'Dashboard';
  }

  get sectionSubtitle() {
    if (this.activeMenuCode === 'Companies') return 'Manage Panchayat companies, supervisors, and office allocations.';
    if (this.activeMenuCode === 'Users') return 'Review and manage user access across the Gram Panchayat network.';
    return 'View active metrics and quick actions for your administration team.';
  }

  get profileInitials() {
    const email = this.profileEmail || this.email || 'Admin';
    return email.trim().charAt(0).toUpperCase();
  }

  protected readonly title = signal('GramApp');

  private selectInitialMenu(): void {
    this.activeMenuCode = this.menus.find(x => x.code === 'Dashboard')?.code ?? this.menus[0]?.code ?? '';
  }

  private ensureActiveMenu(): void {
    if (!this.menus.some(x => x.code === this.activeMenuCode)) this.selectInitialMenu();
  }
}
