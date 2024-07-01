import { AutoMap } from '@automapper/classes';

export class GetMovieDtoSuccess {
  Response!: 'True';

  @AutoMap()
  Title!: string;

  @AutoMap()
  Year!: string;

  @AutoMap()
  imdbID!: string;

  @AutoMap()
  imdbRating!: string;

  @AutoMap()
  Poster!: string;
}

class GetMovieDtoError {
  Response!: 'False';
  Error!: string;
}

export type GetMovieDto = GetMovieDtoSuccess | GetMovieDtoError;
