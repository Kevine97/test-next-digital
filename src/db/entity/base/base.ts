import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  createdAt?: string;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    nullable: true,
  })
  updatedAt?: string;
}
