import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1671485446508 implements MigrationInterface {
    name = 'Seed1671485446508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO qubis (slug, "userCount") VALUES 
            ('qubi-1','2')`
        );
        await queryRunner.query(
            `INSERT INTO users (firstname, lastname, email, password, role) VALUES 
                ('nure','abadir', 'nure@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa','ADMIN')`
        );
        await queryRunner.query(
            `INSERT INTO users (firstname, lastname, email, password, role, "qubiId") VALUES 
                ('user1','user1lastname', 'user1@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa','USER', '1'),
                ('user2','user2lastname', 'user2@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa','USER', '1')`
        );
    }

    public async down(): Promise<void> {
    }

}
