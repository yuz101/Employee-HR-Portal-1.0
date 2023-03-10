import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from 'src/app/models/employee';
import { filter } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { EmployeeApiActions } from 'src/app/store/actions/employees.action';
import { selectEmployees } from 'src/app/store/selectors/employees.selector';
import { AppState } from 'src/app/store/app.state';


@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.css']
})
export class EmployeeProfilesComponent implements OnInit {
  employees$:Observable<Employee[]> = this.store.select(selectEmployees);

  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';


  constructor(
    private apiService: EmployeeService, 
    private store: Store
    ) {}



  ngOnInit() {
    this.apiService.getAllProfiles().subscribe(
      (res) => {
        console.log('Response from API:', res);
        this.store.dispatch(EmployeeApiActions.retrievedEmployeesProfiles({ employees: res }));
      },
      (error) => {
        console.log('Error from API:', error);
      }
    );

      this.apiService.get_all_profiles().subscribe(
      (data: any) => {
        console.log(data.employees);
        this.employees = data.employees.map((employee: any) => {
          return {
            _id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            preferredName: employee.preferredName,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            ssn: employee.ssn,
            address: employee.address,
            workAuthorizationTitle: employee.workAuthorizationTitle,
            showDetails: false
          }
        });
        this.employees = this.sortEmployees(this.employees);
      }
    );
  
  }


  sortEmployees(employees: Employee[]): Employee[] {
    return employees.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      }
      if (a.lastName > b.lastName) {
        return 1;
      }
      return 0;
    });
  }

  toggleDetailView(employee: Employee) {
    employee.showDetails = !employee.showDetails;
    const profileUrl = `/employees/${employee._id}`;
    const newWindow = window.open(profileUrl, '_blank');
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>Employee Profile: ${employee.firstName ?? ''} ${employee.lastName ?? ''}</title>
        </head>
        <body>
          <div *ngIf="employee.showDetails">
            <h3 class="text-base font-semibold leading-6 text-gray-900">${employee.firstName ?? ''} ${employee.lastName ?? ''}</h3>
            <p>
              ${employee.preferredName ? (
                `<div>
                  <label>Preferred Name: </label>
                  <span>${employee.preferredName}</span>
                </div>`
              ) : ''}
            </p>
            <p>
            ${employee.ssn ? (
              `<div>
                <label>SSN: </label>
                <span>${employee.ssn}</span>
              </div>`
            ) : ''}
            </p>
            <p>
            ${employee.workAuthorizationTitle ? (
              `<div>
                <label>Work Authorization Title: </label>
                <span>${employee.workAuthorizationTitle}</span>
              </div>`
            ) : ''}
            </p>
            ${employee.email ? (
              `<div>
                <label>Email: </label>
                <span>${employee.email}</span>
              </div>`
            ) : ''}
            </p>
            ${employee.phoneNumber ? (
              `<div>
                <label>Phone: </label>
                <span>${employee.phoneNumber}</span>
              </div>`
            ) : ''}
            </p>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
    }
  }

  
  search(): void {
    if (this.searchTerm) {
      this.filteredEmployees = this.employees.filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`;
        return fullName.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      this.filteredEmployees = this.sortEmployees(this.filteredEmployees);
    } else {
      this.filteredEmployees = this.sortEmployees(this.employees);
    }
  }
}
