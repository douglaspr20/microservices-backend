import {
  IAppointCerboResponse,
  IAppointmentCerbo,
} from 'src/interfaces/appointment';

export const formatHealthAppointment = (
  appointment: IAppointmentCerbo,
): IAppointCerboResponse => {
  return {
    id: appointment.id,
    title: appointment.title,
    appointmentStatus: appointment.appointment_status,
    providers: appointment.associated_providers.map((provider) => ({
      id: provider.id,
      firstName: provider.first_name,
      lastName: provider.last_name,
    })),
    telemedicine: {
      isTelemedicine: appointment.telemedicine.is_telemedicine,
      telemedicineUrl: appointment.telemedicine.telemedicine_url,
    },
    startDateTime: appointment.start_date_time,
    endDateTime: appointment.end_date_time,
    appointmentType: appointment.appointment_type,
    appointmentNote: appointment.appointment_note,
  };
};

export const formatHealthAppointmentArray = (
  appointments: IAppointmentCerbo[],
): IAppointCerboResponse[] => {
  return appointments.map((appointment) =>
    formatHealthAppointment(appointment),
  );
};
