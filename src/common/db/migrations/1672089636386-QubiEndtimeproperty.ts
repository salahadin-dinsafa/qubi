import { MigrationInterface, QueryRunner } from "typeorm";

export class QubiEndtimeproperty1672089636386 implements MigrationInterface {
    name = 'QubiEndtimeproperty1672089636386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qubi_users" DROP CONSTRAINT "FK_7609f5163f0aa51c98fece1f73f"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."qubi_users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ALTER COLUMN "role" TYPE "public"."qubi_users_role_enum" USING "role"::"text"::"public"."qubi_users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ADD CONSTRAINT "FK_843580043f8dd18f6a9da1a1994" FOREIGN KEY ("qubiId") REFERENCES "qubis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qubi_users" DROP CONSTRAINT "FK_843580043f8dd18f6a9da1a1994"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."qubi_users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "qubi_users" ADD CONSTRAINT "FK_7609f5163f0aa51c98fece1f73f" FOREIGN KEY ("qubiId") REFERENCES "qubis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
