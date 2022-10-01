export interface IPatientRx {
  object: string;
  id: number;
  name: string;
  strength: string;
  frequency: string;
  doses_rxed: string;
  roa: string;
  refills_rxed: number;
  is_chronic: boolean;
  is_admin_record: boolean;
  generic_ok: boolean;
  instructions_to_pt: string;
  instructions_to_dr: string;
  instructions_to_pharmacist: string;
  is_discontinued: boolean;
  date_discontinued: null;
  is_expired: boolean;
  date_expired: string;
  drug_details: DrugDetails;
  encounter_id: null;
  url_encounter: null;
  pt_id: number;
  addedby: number;
  created: string;
}

export interface DrugDetails {
  id: number;
  name: string;
  product_name: string;
  generic_name: string;
  dose_form: string;
  va_id: string;
  medispan_id: string;
  ndcndf_id: string;
  url_drug: string;
}
