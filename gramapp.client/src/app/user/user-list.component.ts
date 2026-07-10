import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { finalize } from 'rxjs/operators';
import { normalizePagedResult } from '../services/paged-result';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  items: any[] = [];
  page = 1;
  pageSize = 10;
  totalCount = 0;
  isLoading = false;
  errorMessage = '';
  showForm = false;
  formModel: any = null;
  isUpdate = false;

  constructor(
    private service: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }
  load() {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getUsers(this.page,this.pageSize).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (r:any) => {
        const result = normalizePagedResult(r);
        this.items = result.items;
        this.totalCount = result.totalCount;
      },
      error: () => {
        this.errorMessage = 'Users could not be loaded.';
        this.items = [];
        this.totalCount = 0;
      }
    });
  }
  prev() { if (this.page>1) { this.page--; this.load(); } }
  next() { if (this.page * this.pageSize < this.totalCount) { this.page++; this.load(); } }
  openAdd() { this.isUpdate = false; this.formModel = { email:'', password:'', companyId:1, isSuperAdmin: false }; this.showForm = true; }
  openEdit(u:any){ this.isUpdate = true; this.formModel = { ...u }; this.showForm = true; }
  onSaved(r:any){ this.showForm = false; this.load(); }
  delete(id:string){ if(!confirm('Delete user?')) return; this.service.deleteUser(id).subscribe(()=> this.load()); }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

}
