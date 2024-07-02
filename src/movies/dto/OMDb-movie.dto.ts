import { AutoMap } from '@automapper/classes';

export class OMDbMovieDto {
  @AutoMap()
  imdbID!: string;

  @AutoMap()
  Title!: string;

  @AutoMap()
  Year!: string;

  @AutoMap()
  imdbRating!: string;

  @AutoMap()
  Poster!: string;
}
