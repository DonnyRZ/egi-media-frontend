# AGENTS.md

# Project Rules

Project: Next.js 15 + TypeScript

Seluruh AI Agent WAJIB mengikuti aturan berikut sebelum menulis kode.

---

# Core Principles

Prioritas utama:

1. Readability > Clever Code
2. Simplicity > Complexity
3. SOLID Principle
4. DRY (Don't Repeat Yourself)
5. KISS (Keep It Simple)
6. Composition over Inheritance
7. Separation of Concerns
8. Type Safety First
9. Reusable Component
10. Performance by Default

---

# Git Workflow (WAJIB)

Sebelum membuat perubahan kode apa pun, AI WAJIB mengikuti langkah berikut.

## 1. Checkout develop

```bash
git checkout develop
```

## 2. Pull develop terbaru

```bash
git pull origin develop
```

AI tidak boleh membuat branch dari develop yang belum update.

---

## 3. Buat branch baru

Gunakan format berikut.

```
feature/<nama-fitur>
fix/<nama-bug>
hotfix/<nama-hotfix>
refactor/<nama-refactor>
docs/<nama-dokumentasi>
test/<nama-testing>
build/<nama-build>
ci/<nama-ci>
chore/<nama-task>
perf/<nama-optimasi>
```

Contoh

```bash
git checkout -b feature/login-google
```

---

## 4. Push branch baru

Setelah branch dibuat

```bash
git push -u origin feature/login-google
```

---

## 5. Kerjakan seluruh perubahan pada branch tersebut

AI TIDAK BOLEH mengubah

- main
- master
- develop

secara langsung.

---

## 6. Conventional Commit

Gunakan

```
feat:
fix:
refactor:
perf:
style:
docs:
test:
build:
ci:
chore:
revert:
```

Contoh

```
feat(auth): implement Google login
```

---

## 7. Dilarang

AI tidak boleh menjalankan

```
git merge

git rebase

git push --force
```

kecuali diminta user.

---

## 8. Sebelum Pull Request

Pastikan

- lint sukses
- build sukses
- test sukses (jika ada)
- branch sudah di-push

---

## 9. Pull Request

Selalu buat Pull Request menuju

```
develop
```

Jangan merge sendiri.

---

# General Rules

## ALWAYS

- gunakan TypeScript strict
- gunakan functional component
- gunakan App Router
- gunakan Server Component sebagai default
- gunakan Client Component hanya bila memerlukan useState, useEffect, event handler, atau browser API
- gunakan async/await
- gunakan interface untuk object
- gunakan type untuk union
- gunakan early return
- gunakan optional chaining
- gunakan nullish coalescing
- gunakan alias import (`@/`) dibanding relative path panjang

## NEVER

- jangan gunakan any
- jangan membuat file >250 baris
- jangan membuat function >40 baris
- jangan hardcode endpoint
- jangan hardcode API key
- jangan hardcode URL
- jangan duplicate code
- jangan menaruh business logic di component
- jangan fetch langsung dari UI jika dapat dipindahkan ke service

---

# SOLID Principle

## Single Responsibility

Satu file hanya satu tanggung jawab.

Component → UI

Hook → State & interaction

Service → API

Mapper → Transformasi data

Validator → Validasi

Utils → Helper

---

## Open Closed

Gunakan strategy, configuration object atau polymorphism.

Hindari if-else panjang.

---

## Liskov Substitution

Child component tidak boleh mengubah perilaku parent.

---

## Interface Segregation

Gunakan interface kecil.

Jangan membuat interface dengan puluhan field jika bisa dipisah.

---

## Dependency Inversion

Dependency harus mengalir

```
Page

↓

Feature Component

↓

Hook

↓

Service

↓

API
```

UI tidak boleh mengetahui implementasi API.

---

# Folder Structure

```
src/

app/

components/
    ui/
    common/
    layout/

features/
    auth/
        api/
        components/
        hooks/
        services/
        schemas/
        types/
        utils/

    article/
    dashboard/

hooks/

services/

lib/

providers/

store/

constants/

types/

utils/

styles/
```

---

# Component Rules

- maksimal 250 baris
- reusable
- tidak mengandung business logic
- hanya bertugas render UI

Gunakan Composition Pattern.

---

# Hooks

Semua reusable logic dipindahkan ke hook.

Hook tidak boleh mengembalikan JSX.

---

# API

Semua komunikasi API dilakukan melalui service.

```
Component

↓

Hook

↓

Service

↓

API
```

Tidak boleh fetch langsung dari component.

---

# Validation

Gunakan

- Zod

---

# Form

Gunakan

- React Hook Form
- Zod Resolver

---

# Styling

Gunakan TailwindCSS.

Urutan class

- Layout
- Flex/Grid
- Size
- Spacing
- Border
- Background
- Typography
- Effect
- Animation

---

# Naming Convention

Component

```
UserCard.tsx
```

Hook

```
useUser.ts
```

Service

```
user.service.ts
```

Schema

```
user.schema.ts
```

Mapper

```
user.mapper.ts
```

Types

```
user.types.ts
```

Constant

```
user.constants.ts
```

Utils

```
formatDate.ts
```

---

# Import Order

1 React

2 Next.js

3 Third Party

4 Alias (@/)

5 Relative

---

# State Management Priority

1 Server Component

2 URL Search Params

3 React State

4 Context

5 Global Store

---

# Error Handling

Gunakan

```
try
catch
finally
```

Gunakan custom error.

---

# Environment

Semua konfigurasi menggunakan

```
.env
```

Tidak boleh hardcode.

---

# Logging

Development boleh menggunakan console.

Production tidak boleh menyisakan console.

---

# Performance

Gunakan

- React.memo
- useMemo
- useCallback

hanya jika memang diperlukan.

Jangan melakukan premature optimization.

---

# Accessibility

Selalu gunakan

- semantic HTML
- alt image
- label
- aria-label jika diperlukan

---

# Responsive

Semua halaman wajib Mobile First.

---

# Testing Ready

Pisahkan

- service
- hook
- util

agar mudah di-unit test.

---

# AI Decision Rules

Sebelum membuat kode

1. Analisis struktur project.
2. Ikuti pola yang sudah ada.
3. Reuse component sebelum membuat baru.
4. Hindari duplicate code.
5. Jangan mengubah arsitektur tanpa alasan kuat.
6. Jelaskan trade-off jika terdapat lebih dari satu solusi.
7. Selalu prioritaskan maintainability.

---

# Final Checklist

Pastikan

- ✅ develop sudah di-pull
- ✅ branch baru dibuat
- ✅ branch sudah di-push
- ✅ tidak ada any
- ✅ tidak ada duplicate code
- ✅ lint sukses
- ✅ build sukses
- ✅ test sukses (jika ada)
- ✅ component kecil
- ✅ business logic dipisahkan
- ✅ type-safe
- ✅ reusable
- ✅ mudah dibaca
- ✅ mengikuti SOLID