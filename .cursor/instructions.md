Cursor Project Instructions — SaaS CRM / Ticketing System

These instructions guide Cursor on how to write, modify, and organize code for this project.
Follow every rule unless the user explicitly asks otherwise.

🚀 1. Project Overview

        You are building a SaaS CRM & Ticketing System with:

        Node.js (TypeScript)

        Express or NestJS backend

        PostgreSQL + Prisma ORM

        Redis + BullMQ for queues

        JWT auth (access + refresh tokens)

        Multi-tenant design (organization-based)

        React/Next.js frontend (optional)

        S3 for file uploads

        Socket.io for realtime updates

        Cursor must generate production-grade, maintainable, type-safe code.

📂 2. Folder Structure Rules

Cursor should follow this folder structure unless the user instructs otherwise:

    /server
    /src
        /config
        /modules
        /auth
        /users
        /organizations
        /tickets
        /customers
        /attachments
        /notifications
        /common
        /middlewares
        /guards
        /interceptors
        /filters
        /jobs
        /queues
        /workers
        /libs
        prisma.ts
        redis.ts
        /utils
    /tests

    /prisma
    schema.prisma

    /frontend (optional React app)


Each module must contain:

    module/
    controller.ts
    service.ts
    dto/
    routes.ts (if Express)

🔐 3. Authentication & Security Rules

    Cursor must implement:

    JWT access tokens (15–30 min)

    Refresh tokens stored hashed in DB

    Password hashing with bcrypt

    Role-based access (Admin, Manager, Agent, Customer)

    Ensure organization isolation for all tenant-specific data

    Validate input with Zod or class-validator

    Never expose sensitive fields (password, token_hash) in responses.

    🗄 4. Database & ORM Rules (Prisma)

    Every multi-tenant table must include:
    organizationId String @db.Uuid

    Use UUIDs for IDs (@id @default(uuid()))

    Relations must specify onDelete = Cascade when appropriate

    Add createdAt & updatedAt fields using Prisma defaults

    Cursor must always update the Prisma schema if models change.

🧵 5. Coding Style Guide

    Backend (TS)

    Strict TypeScript: "strict": true

    Use async/await everywhere (no Promises chaining)

    Avoid any type unless explicitly instructed

    Use controllers for request handling & services for logic

    Use DTOs for request validation

    Formatting

    ESLint + Prettier

    Keep functions small & reusable

    🛠 6. API Design Rules

    Cursor must always:

    Use RESTful conventions

    Use pagination (limit, page or cursor-based)

    Return consistent JSON responses:

    Success:

    {
    "success": true,
    "data": {}
    }


    Error:

    {
    "success": false,
    "message": "Error message"
    }


    Validate inputs on all endpoints.

    Include organization-scoping in every multi-tenant endpoint.

🧩 7. Realtime Rules (Socket.io)

    Join rooms:

    org:<organizationId>

    user:<userId>

    Emit events for:

    ticket:created

    ticket:updated

    message:new

    Authenticate socket connections using JWT in handshake.

📦 8. Queues & Background Workers (BullMQ)

    Jobs must be used for:

    Email sending

    Report generation

    Ticket SLA reminders

    Webhook retries

    Queue rules:

    Queue names must follow: module.action (e.g., email.send)

    Workers must be stateless

    Log job failures with retry policies

🖼 9. File Upload Rules

    Use signed URL upload for large files

    Store only file metadata in DB

    Upload to S3 bucket:
    tenant-files/<organizationId>/<ticketId>/<filename>

    Metadata stored:

    filename

    mimetype

    size

    s3Key

    uploadedBy

    ticketId/commentId

🧪 10. Testing Requirements

    Cursor must generate tests using:

    Jest + Supertest for backend

    Use Testcontainers or Docker for Postgres in tests

    Mock external services (S3, Stripe)

    Tests should cover:

    Auth flow

    Tickets CRUD

    Permissions & RBAC

    Attachments

    Multi-tenancy isolation

🧹 11. Clean Code & Architecture Rules

    Cursor must follow SOLID principles:

    Controllers = minimal logic

    Services = business logic

    Repositories (optional) = DB logic

    DTOs = request validation

    Guards = auth + RBAC

    Do not place business logic directly inside controllers.

🛡 12. Error Handling Rules

    All errors must be normalized into:

    throw new AppError("Reason message", 400);


    Cursor should generate:

    Global error handler

    Known errors: validation, authentication, not found, DB constraint

    Unknown errors → 500

🌐 13. Environment & Config Rules

    Env variables must be accessed only via a config module like:

    config/
    index.ts


    Required variables:

    DATABASE_URL

    REDIS_URL

    JWT_SECRET

    JWT_REFRESH_SECRET

    AWS_ACCESS_KEY

    AWS_SECRET_KEY

    AWS_BUCKET

    STRIPE_SECRET

    NODE_ENV

    Cursor must never hardcode secrets.

📘 14. Documentation Rules

    Cursor should automatically generate:

    API documentation (OpenAPI / Swagger)

    README updates when APIs or modules change

    Migration notes when DB schema changes

🚨 15. IMPORTANT — Cursor Must:

    Write modular & scalable code

    Maintain a consistent architecture

    Never break multi-tenancy rules

    Ensure strong typing everywhere

    Ask for missing details if needed

    Suggest improvements when code smells

    Keep PRs small and focused