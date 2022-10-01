export class GetRxesResponseDto {
  rxes?: RxDto[];
}

interface RxDto {
  id: number;
  name: string;
  strength: string;
  frequency: string;
  doses: string;
  refills: number;
  isDiscontinued: boolean;
  dateDiscontinued: string;
  isExpired: boolean;
  dateExpired: string;
  created: string;
  drugDetails: {
    id: number;
    name: string;
    productName: string;
    doseForm: string;
  };
}
