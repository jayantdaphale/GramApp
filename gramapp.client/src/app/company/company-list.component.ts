import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company/company.service';
import { finalize } from 'rxjs/operators';
import { normalizePagedResult } from '../services/paged-result';

@Component({
  selector: 'app-company-list',
  standalone: false,
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
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
    private service: CompanyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }
  load() {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getCompanies(this.page,this.pageSize).pipe(
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
        this.errorMessage = 'Companies could not be loaded.';
        this.items = [];
        this.totalCount = 0;
      }
    });
  }
  prev() { if (this.page>1) { this.page--; this.load(); } }
  next() { if (this.page * this.pageSize < this.totalCount) { this.page++; this.load(); } }
  openAdd() { this.isUpdate = false; this.formModel = { name: '', description: '', location: '' }; this.showForm = true; }
  openEdit(item:any){ this.isUpdate = true; this.formModel = { ...item }; this.showForm = true; }
  onSaved(result:any){ this.showForm = false; this.load(); }
  delete(id:number){ if(!confirm('Delete company?')) return; this.service.deleteCompany(id).subscribe(()=> this.load()); }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

}
