import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyService } from '../services/company/company.service';

@Component({
  selector: 'app-company-form',
  standalone: false,
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent {
  @Input() isUpdate = false;
  @Input() model: any = { name: '', description: '', location: '' };
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private service: CompanyService) {}

  save() {
    if (this.isUpdate) {
      if (!this.model.id) {
        this.saved.emit(this.model);
        return;
      }
      this.service.updateCompany(this.model.id, this.model).subscribe((r:any) => this.saved.emit(r));
    } else {
      this.service.createCompany(this.model).subscribe((r:any) => this.saved.emit(r));
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
