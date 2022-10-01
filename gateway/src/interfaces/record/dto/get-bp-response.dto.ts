export class GetBpResponseDto {
  bp?: BpDto[];
}

interface BpDto {
  id: string;
  dateTaken: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}
