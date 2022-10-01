export class GetVaccinesResponseDto {
  vaccines?: VaccineDto[];
}

interface VaccineDto {
  id: string;
  vaccineName: string;
  dose: string;
  site: string;
  dateAdministered: string;
}
