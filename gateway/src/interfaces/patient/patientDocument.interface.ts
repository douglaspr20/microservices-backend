export interface IPatientDocument {
  object: string;
  id: number;
  pt_id: number;
  name: string;
  flag: boolean;
  filename: null;
  pmh: boolean;
  dr_review_date: null;
  dr_reviewer: number;
  pt_notified: boolean;
  pt_notified_method: string;
  pt_portal_allowed: boolean;
  pt_portal_allowed_date: string;
  addedby: number;
  url_document_content: string;
  portal_notifications: any[];
  associated_encounters: any[];
  folder: string;
  subfolder: null;
  mime_type: string;
  requires_review: boolean;
  review_status: number;
  result_code: string;
  follow_up_required_date: null;
  file_size: number;
  content: string;
  created: string;
}
