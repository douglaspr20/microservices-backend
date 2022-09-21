export interface IAppointmentType {
  object: string;
  id: number;
  name: string;
  name_portal: string;
  color_hex: string;
  description: string;
  allow_on_portal: boolean;
  number_of_overlaps_to_allow: number;
  portal_notice: string;
  which_providers: number[];
  default_length: number;
  default_status: string;
  sort_order: number;
  telemedicine: boolean;
  email_notice_on: boolean;
  email_notice: string;
  email_notice_subject: EmailNoticeSubject;
  email_reminder_on: boolean;
  email_reminder: string;
  email_reminder_subject: EmailReminderSubject;
  email_reminder_hrs_before: number;
  sms_reminder_on: boolean;
  sms_reminder: SMSReminder;
  sms_reminder_hrs_before: number;
  is_active: boolean;
  inactive_date: null;
  created: string;
  created_by: number;
}

export enum EmailNoticeSubject {
  Empty = '',
  Hello = 'Hello',
}

export enum EmailReminderSubject {
  Empty = '',
  ReminderEmail = 'Reminder Email',
  The48HrNotice = '48Hr Notice',
}

export enum Object {
  AppointmentType = 'appointment_type',
}

export enum SMSReminder {
  Empty = '',
  ReminderSMSTEST = 'Reminder SMS TEST',
  Smile = 'Smile :)',
}
