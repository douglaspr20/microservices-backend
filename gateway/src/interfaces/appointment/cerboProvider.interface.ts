export interface ICerboProvider {
  object: string;
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  prefix: string;
  suffix: string;
  npi: string;
  email: string;
  is_resource: boolean;
  has_calendar: boolean;
  user_notes: string;
  active: boolean;
  display_name_for_messages: string | null;
  display_name_for_appointments: string | null;
  created: string;
}
