import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  FirstName: string;

  @Column('text')
  LastName: string;

  @Column('text')
  Email: string;

  @Column('text')
  Password: string;

  @Column('text')
  State: string;

  @Column('bigint')
  WorkPhone: number;

  @Column('date')
  Birthdate: string;

  @Column('text', {
    nullable: true,
  })
  MindBodyToken: string;

  @Column('int')
  MindBodyClientId: number;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.Email = this.Email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
