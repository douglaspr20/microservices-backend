export class GetHeightsResponseDto {
  heights?: HeightDto[];
}

interface HeightDto {
  id: string;
  dateTaken: string;
  height: number;
  units: string;
}
