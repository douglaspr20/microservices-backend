export interface IAppointCerboResponse {
  id: number;
  title: string;
  appointmentStatus: string;
  providers: Provider[];
  telemedicine: {
    isTelemedicine: boolean;
    telemedicineUrl: null | string;
  };
  startDateTime: string;
  endDateTime: string;
  appointmentType: string;
  appointmentNote: string;
}

interface Provider {
  id: number;
  firstName: string;
  lastName: string;
}
