This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started


clone the repository locally

cd into the repository

```bash
pnpm i
```

create a .env file in the root of the project 

paste your database url in the .env file for Ex.

DATABASE_URL="postgres://postgres:[password].[dbstring]:[port]/postgres"

paste your JWT secret in the .env file, this can be any random string you want for Ex.

JWT_SECRET="WyvV7oKWPLkfPWWj0qk9vnlu7"

```bash
pnpx prisma generate && pnpx prisma migrate dev
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Table Spot is a restaurant reservation application built with Next.js 13. It features a user-friendly booking and availability system that allows customers to easily reserve a table at their desired restaurant. The application also includes an authentication system that utilizes JWT for secure session management, ensuring that user data is protected. Additional features include conditional rendering, middleware, and cookies for enhanced user experience and seamless navigation. Data management is handled through a PostgreSQL database and Prisma ORM, ensuring efficient and reliable data storage and retrieval. The application is designed to provide a seamless and convenient experience for customers looking to book a table at their favorite restaurant.
