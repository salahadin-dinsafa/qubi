import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQubiWithRelation1671575346526 implements MigrationInterface {
    name = 'CreateQubiWithRelation1671575346526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qubis" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "duration" integer NOT NULL DEFAULT '1', "amount" integer NOT NULL DEFAULT '5', "userCount" integer NOT NULL DEFAULT '0', "startDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a726b84e4604dc097ac9fb0c758" UNIQUE ("slug"), CONSTRAINT "PK_2cde62922221ce5b401c90825e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "qubiId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7609f5163f0aa51c98fece1f73f" FOREIGN KEY ("qubiId") REFERENCES "qubis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7609f5163f0aa51c98fece1f73f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "qubiId"`);
        await queryRunner.query(`DROP TABLE "qubis"`);
    }

}
