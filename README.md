
# 💻 Portfolio Backend

This is the **backend server** for my personal portfolio project. It is built with **TypeScript**, **Express**, **Prisma**, and **JWT authentication**. It provides APIs for managing **users, projects, and resumes**.

---

## 🚀 Features

* 🔐 **JWT Authentication** – secure login and role-based access
* 💼 **Project Management** – CRUD operations for portfolio projects
* 🧾 **Resume Management** – dynamic resume creation and retrieval
* ⚡ **Type-safe Validation** – using Zod for request validation
* 🌐 **REST API** – structured and modular endpoints
* 🗄️ **Prisma ORM** – database management

---

## 🧱 Tech Stack

| Category   | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| Framework  | [Express.js](https://expressjs.com/)                         |
| Language   | [TypeScript](https://www.typescriptlang.org/)                |
| Database   | [Prisma](https://www.prisma.io/) (with PostgreSQL / MongoDB) |
| Auth       | [JWT](https://jwt.io/)                                       |
| Validation | [Zod](https://zod.dev/)                                      |
| Deployment | [Vercel](https://vercel.com/)                                |
| Email      | Nodemailer (optional)                                        |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── errors/              # Custom error handlers
│   ├── helper/              # Helper functions
│   ├── middlewares/auth/    # Auth middlewares
├── modules/
│   ├── project/             # Project CRUD logic
│   ├── resume/              # Resume CRUD logic
│   └── user/                # User management
├── routes/                  # API routes
├── shared/                  # Shared modules/helpers
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
├── app.ts                   # Express app initialization
└── server.ts                # Server start
prisma/                      # Prisma schema and migrations
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/portfolio-backend.git
cd portfolio-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret

```

### 4️⃣ Run Prisma Migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Run the Server

```bash
npm run dev
```

Server runs on **[http://localhost:5000](http://localhost:5000)**

---

## 🛠️ API Endpoints

### Auth

* `POST /api/auth/register` – Register a new user
* `POST /api/auth/login` – Login and get JWT token

### Projects

* `GET /api/projects` – Get all projects
* `POST /api/projects` – Add new project (admin only)
* `PUT /api/projects/:id` – Update project (admin only)
* `DELETE /api/projects/:id` – Delete project (admin only)

### Resume

* `GET /api/resume/:userId` – Get user resume
* `POST /api/resume` – Create resume (user)
* `PUT /api/resume/:id` – Update resume (user/admin)

---

## 🔐 Authentication

* Use **JWT token** in `Authorization` header:

```http
Authorization: Bearer <your-token>
```

* Certain routes are **protected** based on **user role** (user/admin).

---

## 📦 Scripts

```bash
npm run dev       # Start dev server with tsx watch
npm run build     # Compile TypeScript into dist/
npm start         # Start compiled JS server
npm run test:uploads # Verify image upload and retrieval behavior
```

For production, run `npm run build` before `npm start`. Generated JavaScript stays
in `dist/`, keeping `src/` for TypeScript source. The Prisma configuration remains
in `prisma.config.ts`; Prisma loads it directly. Run `npm run seed:pdf` to regenerate
the profile PDF and seed the knowledge base.

### Image uploads on Vercel

Project images are stored as binary data in PostgreSQL, so they survive redeploys
and do not require a writable application filesystem or another storage service.
Apply the migration before deploying this version:

```bash
npx prisma migrate deploy
```

Send `multipart/form-data` to `POST /api/v1/project/upload-image` with one file
in the `image` field (maximum 4 MB). The response includes `data.url`, `data.path`,
and `data.filename`. Fetch the URL to retrieve the stored image. Existing files
in `uploads/` remain accessible at their original paths.

---

