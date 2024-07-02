import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class LibraryEntry {
  @PrimaryColumn()
  movieId!: number;

  @PrimaryColumn()
  userId!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne(() => Movie, (movie) => movie.libraries, { onDelete: 'CASCADE' })
  movie!: Movie;

  @ManyToOne(() => User, (user) => user.library, { onDelete: 'CASCADE' })
  user!: User;
}
