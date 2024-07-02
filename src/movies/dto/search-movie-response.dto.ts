import { OMDbMovieDto } from './OMDb-movie.dto';

export class SearchMovieSuccessResponseDto {
  Response!: 'True';
  Search!: OMDbMovieDto[];
  totalResults!: string;
}

class SearchMovieErrorResponseDto {
  Response!: 'False';
  Error!: string;
}

export type SearchMovieResponseDto =
  | SearchMovieSuccessResponseDto
  | SearchMovieErrorResponseDto;
