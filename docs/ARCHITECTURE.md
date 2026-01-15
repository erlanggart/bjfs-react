# 🏗️ Arsitektur Docker Setup

## Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         Docker Host                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Docker Network: bogorjunior-network              │ │
│  │                                                            │ │
│  │  ┌─────────────────┐     ┌─────────────────┐             │ │
│  │  │   Frontend      │     │    Backend      │             │ │
│  │  │   Container     │────▶│   Container     │             │ │
│  │  │                 │     │                 │             │ │
│  │  │  React + Vite   │     │  PHP 8.2        │             │ │
│  │  │  Node 20        │     │  Apache         │             │ │
│  │  │  Port: 5173     │     │  Port: 8080     │             │ │
│  │  │                 │     │                 │             │ │
│  │  │  Volume:        │     │  Volume:        │             │ │
│  │  │  ./bogorjunior  │     │  ./bogor_junior │             │ │
│  │  │  /app           │     │  _api           │             │ │
│  │  └─────────────────┘     │  /var/www/html  │             │ │
│  │                          └────────┬────────┘             │ │
│  │                                   │                      │ │
│  │                                   │                      │ │
│  │                          ┌────────▼────────┐             │ │
│  │                          │   Database      │             │ │
│  │                          │   Container     │             │ │
│  │                          │                 │             │ │
│  │  ┌─────────────────┐     │  MySQL 8.0      │             │ │
│  │  │  phpMyAdmin     │────▶│  Port: 3306     │             │ │
│  │  │  Container      │     │                 │             │ │
│  │  │                 │     │  Volume:        │             │ │
│  │  │  Port: 8081     │     │  db_data        │             │ │
│  │  └─────────────────┘     └─────────────────┘             │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Host Volumes:                                                   │
│  ├─ ./bogorjunior/         → Frontend source                    │
│  ├─ ./bogor_junior_api/    → Backend source                     │
│  ├─ ./uploads/             → Shared uploads                     │
│  └─ db_data (Docker Volume)→ Database persistent                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

           ↓                ↓                ↓                ↓
           │                │                │                │
    localhost:5173   localhost:8080   localhost:3306   localhost:8081
       (Frontend)      (Backend)       (MySQL)        (phpMyAdmin)
```

## Flow Request

### 1. User Access Frontend
```
User Browser
    │
    ▼
http://localhost:5173
    │
    ▼
Frontend Container (React)
    │
    └─ Serve React App
    └─ Hot Reload Active
```

### 2. API Request dari Frontend
```
React Component (axios)
    │
    ▼
http://localhost:8080/api/...
    │
    ▼
Backend Container (PHP + Apache)
    │
    ├─ core_init_db_connect.php
    │       │
    │       ▼
    │   Database Container (MySQL)
    │       │
    │       └─ Query Database
    │
    └─ Return JSON Response
        │
        ▼
    Frontend (Display Data)
```

### 3. Database Management via phpMyAdmin
```
User Browser
    │
    ▼
http://localhost:8081
    │
    ▼
phpMyAdmin Container
    │
    └─ Connect to: db:3306
        │
        ▼
    Database Container (MySQL)
```

## Container Details

### 1. Frontend Container
```yaml
Name: bogorjunior-frontend
Base Image: node:20-alpine
Working Dir: /app
Exposed Port: 5173
Volumes:
  - ./bogorjunior:/app
  - /app/node_modules (anonymous)
Command: npm run dev -- --host 0.0.0.0
```

**Features:**
- Hot Module Replacement (HMR)
- Volume mounting untuk live reload
- node_modules tetap di container (performa)

### 2. Backend Container
```yaml
Name: bogorjunior-backend
Base Image: php:8.2-apache
Working Dir: /var/www/html
Exposed Port: 80 → 8080 (host)
Volumes:
  - ./bogor_junior_api:/var/www/html
  - ./uploads:/var/www/html/uploads
Extensions:
  - pdo_mysql
  - mbstring
  - gd
  - zip
```

**Features:**
- Apache dengan mod_rewrite
- Composer installed
- PHP extensions untuk app
- Shared uploads folder

### 3. Database Container
```yaml
Name: bogorjunior-db
Base Image: mysql:8.0
Exposed Port: 3306
Volumes:
  - db_data:/var/lib/mysql
  - ./bogor_junior_api/database:/docker-entrypoint-initdb.d
Environment:
  - MYSQL_DATABASE: bogorjunior
  - MYSQL_USER: bogorjunior
  - MYSQL_PASSWORD: bogorjunior123
```

**Features:**
- Persistent data via volume
- Auto import SQL di init
- Accessible dari host & containers

### 4. phpMyAdmin Container
```yaml
Name: bogorjunior-phpmyadmin
Base Image: phpmyadmin/phpmyadmin
Exposed Port: 80 → 8081 (host)
Environment:
  - PMA_HOST: db
  - PMA_PORT: 3306
```

**Features:**
- Web-based database management
- No installation needed
- Auto connect ke MySQL

## Network Configuration

**Network Name:** bogorjunior-network  
**Driver:** bridge  
**Isolation:** Containers can communicate using service names

**Internal DNS:**
- `frontend` → Frontend container
- `backend` → Backend container
- `db` → Database container
- `phpmyadmin` → phpMyAdmin container

## Volume Strategy

### Development Volumes (Bind Mounts)
```
Host                          →  Container
./bogorjunior/               →  /app
./bogor_junior_api/          →  /var/www/html
./uploads/                   →  /var/www/html/uploads
```

**Benefit:** Live code changes

### Anonymous Volume
```
Container node_modules       →  /app/node_modules
```

**Benefit:** Better performance, avoid host filesystem overhead

### Named Volume
```
Docker Volume (db_data)      →  /var/lib/mysql
```

**Benefit:** Data persistence across container restart

## Development Workflow

```
┌─────────────────────────────────────────────────┐
│  1. Developer edits code in local IDE           │
│     (VSCode, PHPStorm, etc.)                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  2. File changes detected in mounted volume     │
└────────────────┬────────────────────────────────┘
                 │
                 ├─── Frontend ───▶ Vite HMR (Auto reload browser)
                 │
                 └─── Backend  ───▶ PHP no reload needed
                 
┌─────────────────────────────────────────────────┐
│  3. Test immediately in browser                 │
│     http://localhost:5173                       │
└─────────────────────────────────────────────────┘
```

## Security Notes (Development Only)

⚠️ **Setup ini HANYA untuk development:**

- Default passwords (not secure)
- Port exposed ke host
- Debug mode enabled
- No SSL/HTTPS
- Permissive CORS
- Volume mounting (code exposure)

**Untuk Production:**
- Use secrets
- Reverse proxy (Nginx)
- SSL certificates
- Restricted CORS
- No direct port expose
- Build artifacts only (no source)

## Performance Tips

1. **Use .dockerignore:** Exclude node_modules, vendor, .git
2. **Layer caching:** Order Dockerfile commands wisely
3. **Multi-stage builds:** For production images
4. **Volume for node_modules:** Already implemented
5. **BuildKit:** Use DOCKER_BUILDKIT=1

## Maintenance

### Regular Tasks
```bash
# Weekly cleanup
docker system prune

# Backup database
./docker-dev.sh db-export

# Update images
docker-compose pull
docker-compose up -d --build
```

### Monitoring
```bash
# Container stats
docker stats

# Logs
./docker-dev.sh logs

# Health check
docker-compose ps
```

---

**Architecture optimized for local development with hot reload and easy debugging!**
