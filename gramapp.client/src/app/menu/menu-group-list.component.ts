import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { normalizePagedResult } from '../services/paged-result';
import { MenuService } from '../services/menu/menu.service';

@Component({
  selector: 'app-menu-group-list',
  standalone: false,
  template: `
    <div class="master-panel">
      <div class="master-header"><div><h2>Menu Groups</h2><p>{{ totalCount }} menu group records available</p></div><button (click)="openAdd()">Add Menu Group</button></div>
      <div class="master-form" *ngIf="showForm">
        <div class="form-title"><h3>{{ model.id ? 'Edit' : 'Add' }} Menu Group</h3><button class="secondary" (click)="showForm=false">Cancel</button></div>
        <div class="form-grid">
          <label><span>Name</span><input [(ngModel)]="model.name" /></label>
          <label><span>Sort order</span><input type="number" [(ngModel)]="model.sortOrder" /></label>
          <label class="check"><input type="checkbox" [(ngModel)]="model.isActive" /><span>Active</span></label>
        </div>
        <div class="form-actions"><button (click)="save()">Save</button></div>
      </div>
      <p class="state-message" *ngIf="isLoading">Loading menu groups...</p>
      <p class="error" *ngIf="!isLoading && error">{{ error }}</p>
      <p class="state-message" *ngIf="!isLoading && !error && items.length === 0">No menu groups found.</p>
      <div class="table-wrap" *ngIf="!isLoading && !error && items.length > 0"><table><thead><tr><th>Name</th><th>Sort</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let item of items"><td><strong>{{item.name}}</strong></td><td>{{item.sortOrder}}</td><td>{{item.isActive ? 'Active' : 'Inactive'}}</td><td class="actions"><button class="secondary" (click)="edit(item)">Edit</button><button class="danger" (click)="remove(item.id)">Delete</button></td></tr>
      </tbody></table></div>
      <div class="pager" *ngIf="!isLoading && !error"><button type="button" (click)="prev()" [disabled]="page === 1">Prev</button><span>Page {{ page }} of {{ totalPages }}</span><button type="button" (click)="next()" [disabled]="page >= totalPages">Next</button></div>
    </div>`,
  styleUrls: ['./menu-master.css']
})
export class MenuGroupListComponent implements OnInit {
  items: any[] = []; showForm = false; model: any = {}; error = '';
  page = 1; pageSize = 10; totalCount = 0; isLoading = false;
  constructor(private service: MenuService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.isLoading = true; this.error = '';
    this.service.getMenuGroups(this.page, this.pageSize).pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); })).subscribe({
      next: r => {
        const result = normalizePagedResult(r);
        this.totalCount = result.totalCount;
        if (this.page > this.totalPages) { this.page = this.totalPages; this.load(); return; }
        this.items = result.items;
      },
      error: () => { this.items = []; this.totalCount = 0; this.error = 'Menu groups could not be loaded.'; }
    });
  }
  prev(): void { if (this.page > 1) { this.page--; this.load(); } }
  next(): void { if (this.page < this.totalPages) { this.page++; this.load(); } }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }
  openAdd(): void { this.model = { name: '', sortOrder: this.totalCount + 1, isActive: true }; this.showForm = true; this.error = ''; }
  edit(item: any): void { this.model = { ...item }; this.showForm = true; this.error = ''; }
  save(): void {
    const request = this.model.id ? this.service.updateMenuGroup(this.model.id, this.model) : this.service.createMenuGroup(this.model);
    request.pipe(finalize(() => this.cdr.detectChanges())).subscribe({ next: () => { this.showForm = false; this.load(); }, error: e => this.error = e.error?.message ?? 'Menu group could not be saved.' });
  }
  remove(id: number): void { if (confirm('Delete menu group?')) this.service.deleteMenuGroup(id).pipe(finalize(() => this.cdr.detectChanges())).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message ?? 'Menu group could not be deleted.' }); }
}
