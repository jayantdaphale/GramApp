import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CompanyService } from '../services/company/company.service';
import { UserService } from '../services/user/user.service';
import { normalizePagedResult } from '../services/paged-result';

interface DashboardSummary {
  label: string;
  value: number;
  helper: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  companies: any[] = [];
  users: any[] = [];
  totalCompanies = 0;
  totalUsers = 0;
  isLoading = true;
  errorMessage = '';

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      companies: this.companyService.getCompanies(1, 5),
      users: this.userService.getUsers(1, 5)
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: ({ companies, users }: any) => {
        const companyResult = normalizePagedResult(companies);
        const userResult = normalizePagedResult(users);

        this.companies = companyResult.items;
        this.users = userResult.items;
        this.totalCompanies = companyResult.totalCount;
        this.totalUsers = userResult.totalCount;
      },
      error: () => {
        this.errorMessage = 'Dashboard data could not be loaded. Please refresh or sign in again.';
      }
    });
  }

  get summaries(): DashboardSummary[] {
    return [
      {
        label: 'Companies',
        value: this.totalCompanies,
        helper: `${this.companies.length} shown on dashboard`
      },
      {
        label: 'Users',
        value: this.totalUsers,
        helper: `${this.users.length} recent user records`
      },
      {
        label: 'Active Modules',
        value: 2,
        helper: 'Company and user management'
      }
    ];
  }

}
