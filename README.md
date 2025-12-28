# 🕌 K3 Arafah Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Gin-Framework-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Gin">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
</p>

---

## 📋 Deskripsi

> Aplikasi web **full-stack modern** yang terdiri dari **Landing Page Publik**, **Sistem Penerimaan Santri Baru (PSB)**, dan **Dashboard Admin/CMS** yang aman, cepat, dan mendukung multi-bahasa.

### ✨ Highlights

- 🎨 **Modern UI/UX** - Desain responsif dengan animasi smooth menggunakan Framer Motion
- 🌍 **Multi-Language** - Dukungan penuh Bahasa Indonesia & English
- 📱 **PWA Ready** - Installable, offline-capable, mobile-first
- 🔐 **Enterprise Security** - JWT + CSRF + Rate Limiting + RBAC
- ⚡ **High Performance** - Redis caching, optimized queries, lazy loading
- 🎯 **SEO Optimized** - Sitemap, robots.txt, structured data, Open Graph

---

## 🏗️ Arsitektur Sistem

### 🌐 System Overview

```mermaid
flowchart TB
    subgraph Client["🌐 Client Layer"]
        Browser["🖥️ Browser/PWA"]
    end

    subgraph Frontend["⚛️ Frontend - Next.js 15"]
        direction TB
        SSR["🔄 Server Components"]
        CSR["⚡ Client Components"]
        MW["🛡️ Middleware<br/>(Auth + i18n)"]
    end

    subgraph Backend["🔧 Backend - Go/Gin"]
        direction TB
        API["📡 REST API"]
        AUTH["🔐 Auth Layer<br/>(JWT + CSRF)"]
        CACHE["💨 Cache Layer"]
        BL["⚙️ Business Logic"]
        REPO["📦 Repository"]
    end

    subgraph Storage["💾 Storage Layer"]
        PG[("🐘 PostgreSQL")]
        RD[("🔴 Redis")]
        CDN["☁️ Cloudinary CDN"]
    end

    Browser <--> Frontend
    SSR <--> API
    CSR <--> API
    MW --> SSR
    MW --> CSR
    API --> AUTH
    AUTH --> BL
    BL --> CACHE
    BL --> REPO
    CACHE <--> RD
    REPO <--> PG
    BL <--> CDN

    style Frontend fill:#0070f3,color:#fff
    style Backend fill:#00ADD8,color:#fff
    style Storage fill:#336791,color:#fff
```

### 🔄 Request Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as ⚛️ Frontend
    participant M as 🛡️ Middleware
    participant H as 📡 Handler
    participant S as ⚙️ Service
    participant C as 💨 Cache
    participant R as 📦 Repository
    participant DB as 🐘 Database

    U->>F: 1. Request Page
    F->>M: 2. API Request + CSRF Token
    M->>M: 3. Validate Auth + CSRF
    M->>H: 4. Validated Request
    H->>S: 5. Business Logic
    S->>C: 6. Check Cache

    alt ✅ Cache Hit
        C-->>S: Return Cached Data
    else ❌ Cache Miss
        S->>R: Query Data
        R->>DB: SQL Query
        DB-->>R: Result
        R-->>S: Data
        S->>C: Store in Cache (TTL)
    end

    S-->>H: 7. Response
    H-->>F: 8. JSON Response
    F-->>U: 9. Rendered Page
```

---

## 🚀 Fitur Utama

### 🌐 Public Website

| Fitur                 | Deskripsi                                                 | Status |
| --------------------- | --------------------------------------------------------- | ------ |
| 🏠 **Landing Page**   | Hero, statistik animasi, program, galeri, video, prestasi | ✅     |
| 📰 **Artikel/Berita** | List + detail dengan pagination & SEO-friendly slug       | ✅     |
| 🖼️ **Galeri Foto**    | Koleksi foto kegiatan dengan lightbox                     | ✅     |
| 🎬 **Video**          | Integrasi YouTube embed                                   | ✅     |
| 📬 **Form Kontak**    | Kirim pesan langsung ke admin                             | ✅     |
| 🌍 **Multi-Language** | 🇮🇩 Indonesia, 🇬🇧 English                                  | ✅     |
| 📱 **PWA**            | Installable, offline-ready                                | ✅     |

### 📝 Sistem PSB (Penerimaan Santri Baru)

```
                📋 Alur Pendaftaran

   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  Step 1  │ ───► │  Step 2  │ ───► │  Step 3  │
   │   Data   │      │   Data   │      │   Data   │
   │  Santri  │      │   Ortu   │      │  Edukasi │
   └──────────┘      └──────────┘      └──────────┘

   📤 Submit ───► 🔄 PENDING ───► ✅ VERIFIED ───► 🎓 ACCEPTED

```

**Fitur:**

- ✅ Formulir multi-step dengan progress indicator
- ✅ Validasi real-time dengan pesan error terjemahan
- ✅ Upload pas foto ke Cloudinary
- ✅ Status tracking: `PENDING` → `VERIFIED` → `ACCEPTED`/`REJECTED`

### 🔐 Admin Dashboard

| Modul               | Fitur                                 | Icon |
| ------------------- | ------------------------------------- | ---- |
| **Dashboard**       | Overview statistik real-time          | 📊   |
| **Artikel CMS**     | Create, edit, delete dengan auto-slug | 📝   |
| **Galeri Manager**  | Album management + photo upload       | 🖼️   |
| **Video Manager**   | YouTube video CRUD                    | 🎬   |
| **Prestasi**        | Achievement management                | 🏆   |
| **Pesan Masuk**     | Inbox + mark as read                  | 📬   |
| **Data Santri**     | Active students management            | 👨‍🎓   |
| **Pendaftar PSB**   | Verification workflow                 | 📋   |
| **User Management** | Admin CRUD (Super Admin only)         | 👥   |

### 🛡️ Security Features

| Feature                | Implementation                             | Level      |
| ---------------------- | ------------------------------------------ | ---------- |
| 🔐 **Authentication**  | JWT dengan HttpOnly Cookie + Refresh Token | Enterprise |
| 🛡️ **CSRF Protection** | Token-based untuk mutating requests        | Enterprise |
| 🚫 **XSS Prevention**  | Input sanitization (bluemonday)            | Enterprise |
| ⏱️ **Rate Limiting**   | Tollbooth (login: 1/s, upload: 0.5/s)      | Enterprise |
| 👮 **RBAC**            | Role-based access (Admin, Super Admin)     | Enterprise |
| 🔒 **Password**        | bcrypt hashing (cost 10)                   | Enterprise |
| 💨 **Caching**         | Redis dengan smart invalidation            | High       |
| 🗑️ **Soft Delete**     | GORM DeletedAt for data recovery           | Standard   |

---

## 🛠 Tech Stack

### ⚛️ Frontend (`/frontend-next`)

| Kategori           | Teknologi              | Version   |
| ------------------ | ---------------------- | --------- |
| **Framework**      | Next.js (App Router)   | 15.x      |
| **UI Library**     | React                  | 19.x      |
| **Language**       | TypeScript             | 5.x       |
| **Styling**        | TailwindCSS + Radix UI | 4.x       |
| **Animations**     | Framer Motion          | 12.x      |
| **State (Server)** | TanStack Query         | 5.x       |
| **State (Client)** | Zustand                | 5.x       |
| **Forms**          | React Hook Form + Zod  | 7.x + 4.x |
| **i18n**           | next-intl              | 4.x       |
| **PWA**            | @ducanh2912/next-pwa   | 10.x      |
| **Testing**        | Vitest + RTL           | Latest    |
| **Icons**          | Lucide React           | Latest    |
| **Toast**          | Sonner                 | Latest    |

### 🔧 Backend (`/backend-go`)

| Kategori         | Teknologi                      | Version |
| ---------------- | ------------------------------ | ------- |
| **Language**     | Go                             | 1.24    |
| **Framework**    | Gin                            | Latest  |
| **ORM**          | GORM                           | Latest  |
| **Database**     | PostgreSQL                     | 16.x    |
| **Cache**        | Redis (go-redis/v9)            | Latest  |
| **Auth**         | JWT (golang-jwt/v5)            | Latest  |
| **DI Container** | Google Wire                    | Latest  |
| **Migration**    | golang-migrate (Embedded IOFS) | Latest  |
| **File Storage** | Cloudinary                     | Latest  |
| **API Docs**     | Swagger (swaggo)               | Latest  |
| **Logger**       | Zap                            | Latest  |
| **Config**       | Viper                          | Latest  |
| **Sanitizer**    | bluemonday                     | Latest  |
| **Rate Limit**   | tollbooth                      | Latest  |

---

## 🏁 Getting Started

### 📋 Prerequisites

| Requirement        | Version | Required    |
| ------------------ | ------- | ----------- |
| Node.js            | 18+     | ✅          |
| Go                 | 1.24+   | ✅          |
| PostgreSQL         | 14+     | ✅          |
| Redis              | 7+      | ⚡ Optional |
| Cloudinary Account | -       | ✅          |

### 1️⃣ Clone Repository

```bash
git clone https://github.com/muftiardani/k3arafah-web.git
cd k3arafah-web
```

### 2️⃣ Setup Backend

```bash
cd backend-go

# Copy environment file
cp .env.example .env
```

<details>
<summary>📝 <strong>Edit .env configuration</strong></summary>

```env
# ═══════════════════════════════════════════════════════════════
# 🗄️ DATABASE
# ═══════════════════════════════════════════════════════════════
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=k3arafah_db
DB_PORT=5432

# ═══════════════════════════════════════════════════════════════
# 🖥️ SERVER
# ═══════════════════════════════════════════════════════════════
PORT=8080
ENV=development

# ═══════════════════════════════════════════════════════════════
# 🔐 SECURITY
# ═══════════════════════════════════════════════════════════════
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
CSRF_SECRET=your_csrf_secret_key

# ═══════════════════════════════════════════════════════════════
# ☁️ CLOUDINARY
# ═══════════════════════════════════════════════════════════════
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# ═══════════════════════════════════════════════════════════════
# 🔴 REDIS
# ═══════════════════════════════════════════════════════════════
REDIS_ADDR=localhost:6379
REDIS_PASSWORD=

# ═══════════════════════════════════════════════════════════════
# 🌐 CORS
# ═══════════════════════════════════════════════════════════════
ALLOWED_ORIGIN=http://localhost:3000
```

</details>

```bash
# Install dependencies
go mod tidy

# Run database migrations
go run ./cmd/api -migrate

# Start server (port 8080)
go run ./cmd/api
```

> 📖 **Swagger Docs:** http://localhost:8080/swagger/index.html

### 3️⃣ Setup Frontend

```bash
cd frontend-next

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

<details>
<summary>📝 <strong>Edit .env.local configuration</strong></summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
BACKEND_API_URL=http://localhost:8080/api
```

</details>

```bash
# Start development server (port 3000)
npm run dev
```

> 🌐 **Website:** http://localhost:3000

### 4️⃣ Available Commands

<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
</tr>
<tr>
<td>

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run start     # Start production
npm run lint      # ESLint
npm run format    # Prettier
npm run test      # Run tests
npm run analyze   # Bundle analyzer
```

</td>
<td>

```bash
go run ./cmd/api           # Start server
go run ./cmd/api -migrate  # Run migrations
go run ./cmd/api -force 8  # Force version
go run ./cmd/seeder        # Run seeder
go build -o server ./cmd/api  # Build binary
```

</td>
</tr>
</table>

---

## 📡 API Endpoints

### 🌐 Public Routes (No Auth Required)

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| `GET`  | `/api/csrf`                | 🔑 Get CSRF token            |
| `POST` | `/api/login`               | 🔐 Login admin               |
| `POST` | `/api/logout`              | 🚪 Logout                    |
| `POST` | `/api/refresh`             | 🔄 Refresh JWT token         |
| `POST` | `/api/psb/register`        | 📝 Daftar santri baru        |
| `GET`  | `/api/articles`            | 📰 List artikel (pagination) |
| `GET`  | `/api/articles/:id`        | 📄 Detail artikel by ID      |
| `GET`  | `/api/articles/slug/:slug` | 📄 Detail artikel by slug    |
| `GET`  | `/api/galleries`           | 🖼️ List galeri               |
| `GET`  | `/api/galleries/:id`       | 🖼️ Detail galeri             |
| `GET`  | `/api/videos`              | 🎬 List video                |
| `GET`  | `/api/achievements`        | 🏆 List prestasi             |
| `POST` | `/api/contact`             | 📬 Kirim pesan               |

### 🔐 Protected Routes (JWT Required)

| Method   | Endpoint                          | Description                   |
| -------- | --------------------------------- | ----------------------------- |
| `POST`   | `/api/upload`                     | ☁️ Upload media ke Cloudinary |
| `GET`    | `/api/psb/registrants`            | 📋 List pendaftar             |
| `GET`    | `/api/psb/registrants/:id`        | 📋 Detail pendaftar           |
| `PUT`    | `/api/psb/registrants/:id/status` | 🔄 Update status              |
| `PUT`    | `/api/psb/registrants/:id/verify` | ✅ Verifikasi pendaftar       |
| `GET`    | `/api/dashboard/stats`            | 📊 Dashboard statistics       |
| `GET`    | `/api/messages`                   | 📬 List pesan masuk           |
| `PUT`    | `/api/messages/:id/read`          | ✅ Mark as read               |
| `DELETE` | `/api/messages/:id`               | 🗑️ Hapus pesan                |
| `POST`   | `/api/articles`                   | ➕ Create artikel             |
| `PUT`    | `/api/articles/:id`               | ✏️ Update artikel             |
| `DELETE` | `/api/articles/:id`               | 🗑️ Delete artikel             |
| `POST`   | `/api/galleries`                  | ➕ Create galeri              |
| `PUT`    | `/api/galleries/:id`              | ✏️ Update galeri              |
| `DELETE` | `/api/galleries/:id`              | 🗑️ Delete galeri              |
| `POST`   | `/api/galleries/:id/photos`       | 📤 Upload foto ke galeri      |
| `DELETE` | `/api/galleries/photos/:photo_id` | 🗑️ Delete foto                |
| `GET`    | `/api/videos/:id`                 | 🎬 Get video by ID            |
| `POST`   | `/api/videos`                     | ➕ Create video               |
| `PUT`    | `/api/videos/:id`                 | ✏️ Update video               |
| `DELETE` | `/api/videos/:id`                 | 🗑️ Delete video               |
| `POST`   | `/api/achievements`               | ➕ Create prestasi            |
| `PUT`    | `/api/achievements/:id`           | ✏️ Update prestasi            |
| `DELETE` | `/api/achievements/:id`           | 🗑️ Delete prestasi            |

### 👑 Super Admin Only Routes

| Method   | Endpoint                   | Description              |
| -------- | -------------------------- | ------------------------ |
| `GET`    | `/api/admins`              | 👥 List all admins       |
| `POST`   | `/api/admins`              | ➕ Create admin baru     |
| `DELETE` | `/api/admins/:id`          | 🗑️ Delete admin          |
| `PUT`    | `/api/admins/:id/password` | 🔑 Update admin password |

---

## 📂 Project Structure

```
k3arafah-web/
│
├── 🔧 backend-go/
│   ├── cmd/
│   │   ├── api/
│   │   │   ├── main.go           # 🚀 Entry point + graceful shutdown
│   │   │   ├── wire.go           # 🔌 DI configuration
│   │   │   └── wire_gen.go       # 🤖 Generated DI code
│   │   └── seeder/               # 🌱 Database seeder
│   │
│   ├── config/
│   │   ├── config.go             # ⚙️ Viper configuration
│   │   ├── database.go           # 🐘 PostgreSQL connection
│   │   └── redis.go              # 🔴 Redis connection
│   │
│   ├── internal/
│   │   ├── api/
│   │   │   └── router.go         # 🛣️ Route definitions
│   │   ├── handlers/             # 📡 HTTP handlers (10 files)
│   │   ├── middleware/           # 🛡️ Auth, CORS, CSRF, Rate Limit
│   │   ├── models/               # 📦 GORM models (8 files)
│   │   ├── repository/           # 💾 Data access layer (8 files)
│   │   ├── services/             # ⚙️ Business logic (11 files)
│   │   ├── dto/                  # 📋 Data Transfer Objects
│   │   └── utils/                # 🔧 Helpers, errors, responses
│   │
│   ├── migrations/               # 📊 SQL migrations (8 versions)
│   └── docs/                     # 📖 Swagger generated docs
│
├── ⚛️ frontend-next/
│   ├── app/
│   │   ├── [locale]/             # 🌍 i18n dynamic route
│   │   │   ├── (public)/         # 🌐 Public pages
│   │   │   ├── (admin)/          # 🔐 Admin dashboard
│   │   │   ├── (auth)/           # 🔑 Login page
│   │   │   └── layout.tsx        # 📄 Root layout + providers
│   │   ├── api/                  # 🔗 API proxy routes
│   │   ├── robots.ts             # 🤖 SEO robots
│   │   └── sitemap.ts            # 🗺️ SEO sitemap
│   │
│   ├── components/
│   │   ├── ui/                   # 🎨 19 Radix-based components
│   │   ├── landing/              # 🏠 7 Landing sections
│   │   ├── admin/                # 👔 Admin components
│   │   ├── layout/               # 📐 Header, Footer
│   │   └── providers/            # 🔌 Context providers
│   │
│   ├── lib/
│   │   ├── api.ts                # 🔗 Axios + interceptors
│   │   ├── services/             # 📡 API service functions
│   │   ├── hooks/                # 🪝 TanStack Query hooks
│   │   └── utils.ts              # 🔧 Utility functions
│   │
│   ├── store/
│   │   ├── useAuthStore.ts       # 🔐 Auth state (Zustand)
│   │   └── useUIStore.ts         # 🎨 UI state
│   │
│   ├── messages/
│   │   ├── id.json               # 🇮🇩 Indonesian (~19KB)
│   │   └── en.json               # 🇬🇧 English (~19KB)
│   │
│   └── middleware.ts             # 🛡️ Auth + i18n middleware
│
└── 📖 README.md
```

---

## 🗄️ Database Schema

### 📊 Entity Relationship

```mermaid
erDiagram
    USERS ||--o{ ARTICLES : writes
    GALLERIES ||--o{ PHOTOS : contains

    USERS {
        uint id PK
        string username UK
        string password
        string role
        timestamp created_at
    }

    SANTRIS {
        uint id PK
        string full_name
        string nik UK
        string status
        string nis UK
        timestamp created_at
    }

    ARTICLES {
        uint id PK
        string title
        string slug UK
        text content
        uint author_id FK
        bool is_published
    }

    GALLERIES {
        uint id PK
        string title
        string cover_url
    }

    PHOTOS {
        uint id PK
        uint gallery_id FK
        string photo_url
    }

    VIDEOS {
        uint id PK
        string title
        string youtube_id
    }

    ACHIEVEMENTS {
        uint id PK
        string title
        string icon
        string color
    }

    MESSAGES {
        uint id PK
        string name
        string email
        text message
        bool is_read
    }
```

---

## 🌍 Internationalization (i18n)

| Locale | Language        | Status      | Coverage |
| ------ | --------------- | ----------- | -------- |
| `id`   | 🇮🇩 Indonesia    | ✅ Complete | 100%     |
| `en`   | 🇬🇧 English      | ✅ Complete | 100%     |
| `ar`   | 🇸🇦 Arabic (RTL) | 🚧 Planned  | -        |

**URL Pattern:** `/{locale}/path`

- `/id/articles` - Indonesian
- `/en/about` - English

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend-next
npm run test              # Run all tests
```

### Backend Tests

```bash
cd backend-go
go test ./...             # Run all tests
go test ./... -v          # Verbose output
go test ./... -cover      # With coverage
```

---

## 📦 Deployment

### 🏭 Production Build

<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
</tr>
<tr>
<td>

```bash
cd frontend-next
npm run build
npm run start
```

</td>
<td>

```bash
cd backend-go
go build -o server ./cmd/api
./server
```

</td>
</tr>
</table>

### 🔒 Production Environment Checklist

- [ ] Set `ENV=production`
- [ ] Set `ALLOWED_ORIGIN=https://yourdomain.com`
- [ ] Use strong `JWT_SECRET` (32+ chars)
- [ ] Use strong `CSRF_SECRET` (32+ chars)
- [ ] Configure production database credentials
- [ ] Enable HTTPS
- [ ] Set up Redis for production caching

---

## 📄 License

This project is licensed under the **Apache 2.0 License**.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge" alt="Made with Love">
  <img src="https://img.shields.io/badge/For-Pondok_Pesantren_K3_Arafah-green?style=for-the-badge" alt="For K3 Arafah">
</p>
