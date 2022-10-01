export interface IPatientVaccine {
  object: string;
  id: string;
  pt_id: string;
  vaccine_id: string;
  vaccine_name: string;
  dose: string;
  site: string;
  lot: string;
  notes: string;
  in_office: boolean;
  administeredby: string;
  administered: string;
  enteredby: number;
  entered: string;
  next_due: boolean;
}
