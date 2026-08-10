import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@portfolio.com";
  const plainPassword = "AdminPassword123!";
  const name = "Portfolio Owner Admin";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    const updatedAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        role: UserRole.OWNER,
        name: name,
      },
    });
    console.log("SUCCESS: Admin account password & role updated.");
    console.log(`Email: ${updatedAdmin.email}`);
    console.log(`Role: ${updatedAdmin.role}`);
  } else {
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: name,
        role: UserRole.OWNER,
      },
    });
    console.log("SUCCESS: New Admin account created.");
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Role: ${newAdmin.role}`);
  }

  console.log(`Password: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
