export interface IAppointmentCerbo {
  object: string;
  id: number;
  title: string;
  appointment_status: string;
  appointment_location: string;
  recurrance_interval: string;
  recurrance_type: null;
  recurrance_value: null;
  recurrance_group_id: null;
  addedby: number;
  datedeleted: null;
  patient_details: null;
  associated_providers: AssociatedProvider[];
  telemedicine: Telemedicine;
  start_date_time: string;
  end_date_time: string;
  appointment_type: string;
  appointment_note: string;
  created: string;
}

export interface AssociatedProvider {
  object: string;
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  prefix: string;
  suffix: string;
  npi: string;
  email: string;
  is_resouce: boolean;
  associated_by: number;
  date_associated: string;
  is_active_user: boolean;
  url_user_details: string;
}

export interface Telemedicine {
  is_telemedicine: boolean;
  telemedicine_url: null;
}
