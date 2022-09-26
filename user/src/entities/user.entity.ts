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
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  email: string;

  @Column('text')
  gender: string;

  @Column('date')
  birthdate: string;

  @Column('text')
  mobilePhone: string;

  @Column('jsonb', {
    nullable: false,
    default: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  })
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column('text', {
    nullable: true,
  })
  mindBodyToken: string;

  @Column('text')
  mindbodyClientId: string;

  @Column('text')
  cerboPatientId: string;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
