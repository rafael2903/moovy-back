import { Exclude } from 'class-transformer';
import { LibraryEntry } from 'src/library/entities/library.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @OneToMany(() => LibraryEntry, (libraryEntry) => libraryEntry.user)
  library!: LibraryEntry[];
}
