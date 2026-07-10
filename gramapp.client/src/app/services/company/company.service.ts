import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private api: ApiService) {}
  getCompanies(page:number, pageSize:number){ return this.api.getCompanies(page,pageSize); }
  createCompany(dto:any){ return this.api.createCompany(dto); }
  updateCompany(id:number, dto:any){ return this.api.updateCompany(id,dto); }
  deleteCompany(id:number){ return this.api.deleteCompany(id); }
}
