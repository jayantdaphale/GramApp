import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { CompanyService } from '../services/company/company.service';
import { MenuService } from '../services/menu/menu.service';
import { normalizePagedResult } from '../services/paged-result';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() model: any = { email: '', password: '', companyId: 1 };
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  companies: any[] = [];
  menuAccesses: any[] = [];
  error = '';

  constructor(private service: UserService, private companyService: CompanyService, private menuService: MenuService) {}

  ngOnInit(): void {
    forkJoin({ companies: this.companyService.getCompanies(1, 100), menuAccesses: this.menuService.getMenuAccesses() }).subscribe({
      next: result => {
        this.companies = normalizePagedResult(result.companies).items;
        this.menuAccesses = result.menuAccesses.filter(x => x.isActive);
      },
      error: () => this.error = 'Company and menu access options could not be loaded.'
    });
  }

  save() {
    const dto = {
      ...this.model,
      companyId: Number(this.model.companyId),
      menuAccessId: this.model.isSuperAdmin || !this.model.menuAccessId ? null : Number(this.model.menuAccessId)
    };
    if (this.isUpdate) {
      if (!this.model.id) { this.saved.emit(this.model); return; }
      this.service.updateUser(this.model.id, dto).subscribe({ next: (r:any) => this.saved.emit(r), error: () => this.error = 'User could not be updated.' });
    } else {
      this.service.createUser(dto).subscribe({ next: (r:any) => this.saved.emit(r), error: () => this.error = 'User could not be created.' });
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
