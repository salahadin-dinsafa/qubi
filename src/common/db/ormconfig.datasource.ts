import { config } from 'dotenv';
config()
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const ormConfig = (): PostgresConnectionOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '../../../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/**/*.{js,ts}'],
    synchronize: true
})

const datasource: DataSource = new DataSource(ormConfig());
export default datasource;