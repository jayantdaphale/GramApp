import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}
  getUsers(page:number,pageSize:number){ return this.api.getUsers(page,pageSize); }
  createUser(dto:any){ return this.api.createUser(dto); }
  deleteUser(id:string){ return this.api.deleteUser(id); }
  updateUser(id:string, dto:any){ return this.api.updateUser(id,dto); }
}
