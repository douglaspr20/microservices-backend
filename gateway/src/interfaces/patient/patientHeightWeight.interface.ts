export interface IPatientHeightOrWeight {
  object: string;
  id: string;
  pt_id: string;
  date_taken: string;
  height?: number;
  weight?: number;
  units: string;
  comments: null;
  addedby: number;
  created: string;
}
