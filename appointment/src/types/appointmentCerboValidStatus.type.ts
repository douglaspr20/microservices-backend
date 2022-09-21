export type ValidStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-room'
  | 'cancelled'
  | 'possibly';

export const validStatus: ValidStatus[] = [
  'scheduled',
  'confirmed',
  'checked-in',
  'in-room',
  'cancelled',
  'possibly',
];
