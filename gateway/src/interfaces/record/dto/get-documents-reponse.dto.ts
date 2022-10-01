export class GetPatientDocumentsResponseDto {
  documents?: DocumentDto[];
}

interface DocumentDto {
  id: number;
  portalAllowed: boolean;
  portalAllowedDate: string;
  folder: string;
  subfolder: string;
  urlDocument: string;
}
