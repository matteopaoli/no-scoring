require('dotenv').config();
const postgres = require('postgres');

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

const admin = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'secret12',
  role: 'admin',
};

async function createAdminUser() {
  try {
    const bcrypt = await import('bcrypt-ts');
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const query = `
      INSERT INTO public."user" (
        "firstName", "lastName", email, password, role
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      admin.firstName,
      admin.lastName,
      admin.email,
      hashedPassword,
      admin.role,
    ];

    const res = await sql.unsafe(query, values);
    console.log('Admin user created:', res);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await sql.end();
  }
}

createAdminUser();
