import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawPropertyOnUser1671724958824 implements MigrationInterface {
    name = 'WithdrawPropertyOnUser1671724958824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "withdraw" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "withdraw"`);
    }

}
