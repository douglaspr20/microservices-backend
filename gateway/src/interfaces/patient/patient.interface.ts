export interface IPatient {
  object: string;
  id: string;
  nicknames: string;
  dob: string;
  alt_id: string;
  hint_id: string;
  active_campaign_id: string;
  stripe_api_id: null;
  fullscript_id: string;
  email1: string;
  email2: string;
  skype_name: string;
  phone_home: string;
  phone_mobile: string;
  phone_work: string;
  phone_other: string;
  primary_phone: null;
  fax_home: string;
  fax_work: string;
  sex: Sex;
  gender: string;
  address1: string;
  address2: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  insurance_plan: string;
  insurance_group: string;
  insurance_id: string;
  insurance_type: string;
  insurance_phone: string;
  insurance_notes: string;
  billing_plan: string;
  billing_dependent: string;
  group_account: string;
  dependent_of: null;
  portal_access: boolean;
  inactive: boolean;
  inactive_date: string;
  addedby: string;
  deletedby: string;
  lastupdated: string;
  updatedby: string;
  drivers_license_number: null;
  drivers_license_state: null;
  ethnicity: null;
  pronouns: null;
  opt_in_preferences: OptInPreferences;
  tags: Tag[];
  primary_provider_id: number;
  patient_status_description: string;
  url_finances: string;
  url_documents: string;
  url_orders: string;
  url_schedule: string;
  url_encounters: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  created: string;
  address: Address;
  insurance: { [key: string]: string };
  secondary_insurance: { [key: string]: string };
  tertiary_insurance: { [key: string]: string };
  quaternary_insurance: { [key: string]: string };
}

export type Sex = 'M' | 'F';

export interface Address {
  address1: string;
  address2: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export interface OptInPreferences {
  marketing: Marketing;
}

export interface Marketing {
  email: string;
  sms: string;
}

export interface Tag {
  name: string;
  tag_category: string;
  notes: string;
  date_applied: string;
}
