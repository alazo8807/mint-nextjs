This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Pre-requisites
### 1. Set up a plaid account.
Go to plaid.com and create a developer account. You will need a `client_id` and `secret` to set up your environment to communicater with Plaid apis

## Setting up local env
### 1. Create new .env file
In the root folder, create two new files called `.env` and `.env.local`.
### 2. Add env values to .env.local file
This are the values that will be loaded when running the application locally on your device.
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=plaid_env // sandbox|production
``` 
### 3. Add env values to .env file
In theory you can add all your values in this file but I prefer the separation between local and non local. The only reason adding this file for running local is because prisma looks for the db url in this file when running migrations.
```
DATABASE_URL="file:./dev.db"
```
I prefer having a separate db for testing agains PLAID sandbox. Use the corresponding db file in your case.

## Setting Up the Database on a New Device

Follow these steps to set up the database when working on a new device:

### 1. Install Dependencies
Run the following command to install all required dependencies:

```bash
npm install
```

### 2. Set Up Environment Variables
Ensure the `.env` file exists in the root of your project with the correct `DATABASE_URL`. For SQLite, it should look like this:

```env
DATABASE_URL="file:./dev.db"
```
NOTE: prisma doesn't seem to be able to read .env.local, so make sure the `DATABASE_URL` is set up in .env

If you are using a different database file (e.g., prod.db, sandbox.db), update the `DATABASE_URL` accordingly.


### 3. Run Migrations
Apply the existing migrations to set up the database schema:

```bash
npx prisma migrate deploy
```

This command ensures the database structure matches the schema defined in the project.


### 4. Generate the Prisma Client
Regenerate the Prisma Client to ensure it matches the current schema:

```bash
npx prisma generate
```


### 5. Verify the Database (Optional)
To verify the database setup, you can use Prisma Studio:

```bash
npx prisma studio
```

This opens a web interface where you can view and edit the database data.


Your database is now set up and ready to use!

## Adding a migration

### 1. Make Changes to the Schema
Edit the schema.prisma file in your project directory to reflect the changes you want to make in your database structure. For example:

```
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  age   Int?    // Adding a new optional field
}
```
### 2. Run the Migration Command
Open your terminal and navigate to your project directory. Then, run: 
```
npx prisma migrate dev --name <migration-name>
```
NOTE: prisma doesn't seem to be able to read .env.local, so make sure the `DATABASE_URL` is set up in .env
If you are using a different database file (e.g., prod.db, sandbox.db), update the `DATABASE_URL` accordingly.

### 3. Review the Generated SQL
Prisma will generate a migration file in the prisma/migrations directory. It contains SQL instructions for applying your changes. Review it to ensure it aligns with your expectations.

### 4. Apply the Migration
Prisma will automatically apply the migration to your development database. If it doesn’t, you can apply it manually:
```
npx prisma migrate deploy
```

### 5. Check the Database
Use Prisma Studio to inspect the updated database:
`npx prisma studio`
.Alternatively, query your database directly using a database client.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
