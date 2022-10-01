export class GetWeightsResponseDto {
  weights?: WeightDto[];
}

interface WeightDto {
  id: string;
  dateTaken: string;
  weight: number;
  units: string;
}
