import { OMDbMovieDto } from './OMDb-movie.dto';

export class GetMovieSuccessResponseDto extends OMDbMovieDto {
  Response!: 'True';
}

class GetMovieErrorResponseDto {
  Response!: 'False';
  Error!: string;
}

export type GetMovieResponseDto =
  | GetMovieSuccessResponseDto
  | GetMovieErrorResponseDto;
