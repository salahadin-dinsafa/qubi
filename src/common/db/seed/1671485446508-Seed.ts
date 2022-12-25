import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1671485446508 implements MigrationInterface {
    name = 'Seed1671485446508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO qubis (slug, "userCount", "startDate", "endDate") VALUES 
            ('qubi-1','2', '2022-11-22 22:38:53.507358', '2022-12-22 22:38:53.507358'),
            ('qubi-2','0', '2022-12-22 22:38:53.507358', '2023-01-22 22:38:53.507358'),
            ('qubi-3','0', '2022-11-22 22:38:53.507358', '2022-12-25 22:38:53.507358'),
            ('qubi-4','0', '2022-11-22 22:38:53.507358', '2022-12-15 22:38:53.507358')
            `
        );
        await queryRunner.query(
            `INSERT INTO users (firstname, lastname, email, password, role) VALUES 
                ('nure','abadir', 'nure@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa','ADMIN')`
        );
        await queryRunner.query(
            `INSERT INTO users (firstname, lastname, email, password, role, max_maney, left_maney, max_day, left_day, "qubiId") VALUES 
                ('user1','user1lastname', 'user1@gmail.com',
                '$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa','USER',
                '150',
                '150',
                '30',
                '30',
                '1'),
                ('user2','user2lastname', 'user2@gmail.com',
                '$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa','USER',
                '150',
                '150',
                '30',
                '30',
                '1')`
        );
    }

    public async down(): Promise<void> {
    }

}
