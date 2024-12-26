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

If you are using a different database (e.g., PostgreSQL, MySQL), update the `DATABASE_URL` accordingly.


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



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
