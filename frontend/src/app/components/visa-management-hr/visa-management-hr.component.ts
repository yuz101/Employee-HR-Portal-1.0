import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentReviewComponent } from './document-review/document-review.component';
import { EmployeeWorkAuthorizationStatusService } from '../../services/employee-work-authorization-status.service';
import { EmployeeCurrentWorkAuthorizationStatusRecord, EmployeeDocumentLink, WorkAuthorizationDocumentTypeEnum, WorkAuthorizationStatusEnum } from 'src/app/models/work-authorization-status';
import { selectEmployeeWorkAuthorizationStatusRecords } from 'src/app/store/selectors/employee-work-authorization-status-records.selectors';
import { EmployeeWorkAuthorizationStatusRecordsActions } from 'src/app/store/actions/employee-work-authorization-status-records.action';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { EmployeeDocumentService } from 'src/app/services/employee-document.service';
import { Onboarding } from 'src/app/models/onboarding.model';
import { HttpClient } from '@angular/common/http';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';

@Component({
  selector: 'app-visa-management-hr',
  templateUrl: './visa-management-hr.component.html',
  styleUrls: ['./visa-management-hr.component.css'],
  providers: [DialogService, EmployeeWorkAuthorizationStatusService]
})
export class VisaManagementHrComponent implements OnInit {
  workAuthorizationStatusRecords$: Observable<EmployeeCurrentWorkAuthorizationStatusRecord[]>
    = this.store.select(selectEmployeeWorkAuthorizationStatusRecords);

  isLoadingTable: boolean;
  isLoadingAllDocumentLinks: boolean;
  displayWorkAuthorization: boolean;
  allWorkAuthorizationStatus = WorkAuthorizationStatusEnum;
  uploadedDocuments: EmployeeDocumentLink[] = [];
  applicationInfo: Onboarding;
  isLoadingApplicationInfo: boolean = true;
  applicationError: boolean = false;

  constructor(
    private store: Store,
    public dialogService: DialogService,
    private workAuthorizationStatusService: EmployeeWorkAuthorizationStatusService,
    private employeeDocumentService: EmployeeDocumentService,
    private applicationService: OnboardingApplicationService,
  ) { }

  ngOnInit() {
    this.isLoadingTable = true;
    this.workAuthorizationStatusService
      .getEmployeeWorkAuthorizationStatusRecords()
      .subscribe((records) => {
        console.log(records);
        this.store.dispatch(
          EmployeeWorkAuthorizationStatusRecordsActions.retrieveRecordList({ statusRecords: records })
        );
        this.isLoadingTable = false;
      });
  }

  clear(table: Table) {
    table.clear();
  }

  showDocumentReviewDialog(employeeId: string, documentType: WorkAuthorizationDocumentTypeEnum) {
    const ref = this.dialogService.open(DocumentReviewComponent, {
      data: {
        employeeId: employeeId,
        documentType: documentType,
      },
      header: `Review Document: ${documentType}`,
      width: '90%',
    });
  }

  approveDocument(employeeId: string) {
    this.workAuthorizationStatusService
      .approveDocument(employeeId)
      .subscribe((newStatus) => {
        this.store.dispatch(
          EmployeeWorkAuthorizationStatusRecordsActions.approveDocument({ employeeId, newStatus })
        );
      });
  }

  showWorkAuthorizationDialog(employeeId: string) {
    this.isLoadingAllDocumentLinks = true;
    this.applicationError = false;
    this.displayWorkAuthorization = true;
    this.employeeDocumentService.getAllDocuments(employeeId)
      .subscribe((documents) => {
        this.uploadedDocuments = documents['downloadLinks'];
        this.isLoadingAllDocumentLinks = false;
      });

    this.applicationService.getOnboardingApplicationByID(employeeId)
      .subscribe({
        next: (application) => {
          console.log('in not error');
          this.applicationInfo = application;
          console.log('in subscribe application', application);
          this.isLoadingApplicationInfo = false;
        }, error: (error) => {
          console.log('In error');
          this.applicationError = true;
          this.isLoadingApplicationInfo = false;
        }
      });
  }

  sendWorkAuthorizationReminderEmail(employeeId: string) {
    this.workAuthorizationStatusService
      .sendWorkAuthorizationReminderEmailToEmployee(employeeId)
      .subscribe({
        next: (response) => {
          alert('Email sent successfully');
        }, error: (error) => {
          console.log(error);
        }
      });
  }
}