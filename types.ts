declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    BASE_URL: string;
    SECRET_KEY: string;
    ETHEREAL_EMAIL: string;
    ETHEREAL_PASSWORD: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET: string;
  }
}
