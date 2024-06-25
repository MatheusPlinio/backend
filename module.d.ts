declare namespace NodeJS{
    export interface ProcessEnv{
        DATABASE_URL: string;
        NEST_PASSPORT_SECRET: string;
        NEST_PASSPORT_REFRESH_SECRET: string;
    }
}