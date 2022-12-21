import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1671568918921 implements MigrationInterface {
    name = 'CreateUser1671568918921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "max_many" integer NOT NULL DEFAULT '0', "deposited_many" integer NOT NULL DEFAULT '0', "left_many" integer NOT NULL DEFAULT '0', "max_day" integer NOT NULL DEFAULT '0', "deposited_day" integer NOT NULL DEFAULT '0', "left_day" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
