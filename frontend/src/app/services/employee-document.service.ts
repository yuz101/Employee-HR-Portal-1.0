import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { EmployeeDocumentLink, WorkAuthorizationDocumentTypeEnum } from '../models/work-authorization-status';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDocumentService {

  constructor() { }

  getOneDocument(
    employeeId: string,
    documentType: WorkAuthorizationDocumentTypeEnum
  ): Observable<EmployeeDocumentLink> {
    return of(oneDocumentMock);
  }

  getAllDocuments(employeeId: string): Observable<Array<EmployeeDocumentLink>> {
    return of(allDocumentsMock);
  }
}

const oneDocumentMock: EmployeeDocumentLink = {
  fileName: 'opt-receipt',
  downloadUrl: 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
}

const allDocumentsMock: EmployeeDocumentLink[] = [
  {
    fileName: 'opt-receipt.pdf',
    downloadUrl: 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
  },
  {
    fileName: 'opt-ead.pdf',
    downloadUrl: 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
  },
  {
    fileName: 'i-20.pdf',
    downloadUrl: 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf',
  },
];