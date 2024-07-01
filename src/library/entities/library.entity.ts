import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class LibraryEntry {
  @PrimaryColumn()
  movieId!: number;

  @PrimaryColumn()
  userId!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne(() => Movie, (movie) => movie.libraries)
  movie!: Movie;

  @ManyToOne(() => User, (user) => user.library)
  user!: User;
}
