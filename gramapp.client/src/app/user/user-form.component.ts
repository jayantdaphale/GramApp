import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  @Input() isUpdate = false;
  @Input() model: any = { email: '', password: '', companyId: 1 };
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private service: UserService) {}

  save() {
    if (this.isUpdate) {
      if (!this.model.id) { this.saved.emit(this.model); return; }
      this.service.updateUser(this.model.id, this.model).subscribe((r:any)=> this.saved.emit(r));
    } else {
      this.service.createUser(this.model).subscribe((r:any)=> this.saved.emit(r));
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
