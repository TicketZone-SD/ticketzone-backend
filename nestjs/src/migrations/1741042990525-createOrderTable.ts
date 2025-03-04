import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrderTable1741042990525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'event_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'ticket_type_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_price',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pendente', 'Pago', 'Cancelado'],
            isNullable: false,
            default: "'Pendente'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users_user', // ou 'users', se for o nome real
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['event_id'],
            referencedTableName: 'events',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT', // impede a exclusão se houver pedidos associados
          },
          {
            columnNames: ['ticket_type_id'],
            referencedTableName: 'ticket_types',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
