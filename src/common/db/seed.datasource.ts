import { config } from 'dotenv';
config()
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { ormConfig } from './ormconfig.datasource';

const seedConfig = (): PostgresConnectionOptions => ({
    ...ormConfig(),
    migrations: [__dirname + '/seed/**/*.{js,ts}']
})

const datasource: DataSource = new DataSource(seedConfig());
export default datasource;