import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column('text', {
    nullable: true,
  })
  mindBodyClientId: string;

  @Column('text', {
    nullable: true,
  })
  cerboPatientId: string;

  @Column('text', {
    nullable: true,
  })
  refreshToken: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
