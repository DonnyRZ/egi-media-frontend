# DESIGN.md

# EGI Media — Design System

Dokumen ini menjadi acuan utama untuk seluruh desain UI/UX pada project EGI Media.

---

# Brand Identity

EGI Media memiliki karakter:

* Profesional
* Modern
* Teknologi
* Cepat
* Bersih
* Kredibel

Visual utama berasal dari logo EGI Media dengan kombinasi warna biru dan abu terang.

---

# Color Palette

## Primary Colors

| Token         | Hex       | Penggunaan               |
| ------------- | --------- | ------------------------ |
| `primary-900` | `#183E7A` | Background utama, navbar |
| `primary-700` | `#2B5AA0` | Button utama, link aktif |
| `primary-500` | `#3F73C7` | Hover, accent            |
| `primary-100` | `#E8F0FF` | Background soft          |

## Neutral Colors

| Token         | Hex       | Penggunaan         |
| ------------- | --------- | ------------------ |
| `neutral-900` | `#111827` | Text utama         |
| `neutral-700` | `#374151` | Text sekunder      |
| `neutral-500` | `#6B7280` | Text muted         |
| `neutral-300` | `#D1D5DB` | Border             |
| `neutral-100` | `#F3F4F6` | Background ringan  |
| `neutral-50`  | `#F9FAFB` | Background halaman |

## Brand Gray (dari logo)

| Token        | Hex       | Penggunaan                      |
| ------------ | --------- | ------------------------------- |
| `brand-gray` | `#D9D9D9` | Icon, divider, surface sekunder |

## Semantic Colors

| Token     | Hex       |
| --------- | --------- |
| `success` | `#16A34A` |
| `warning` | `#EA580C` |
| `error`   | `#DC2626` |
| `info`    | `#2563EB` |

---

# Tailwind Theme

Tambahkan pada `tailwind.config.ts`

```ts
colors: {
  primary: {
    100: '#E8F0FF',
    500: '#3F73C7',
    700: '#2B5AA0',
    900: '#183E7A',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    300: '#D1D5DB',
    500: '#6B7280',
    700: '#374151',
    900: '#111827',
  },
  brand: {
    gray: '#D9D9D9',
  },
}
```

---

# Typography

## Font Family

Gunakan:

```ts
fontFamily: {
  sans: ['Inter', 'sans-serif'],
}
```

Alasan:

* modern
* sangat terbaca
* cocok untuk media & dashboard
* konsisten di desktop dan mobile

---

# Typography Hierarchy

## Display

Digunakan untuk hero section.

| Token        | Size | Weight |
| ------------ | ---- | ------ |
| `display-xl` | 64px | 700    |
| `display-lg` | 56px | 700    |
| `display-md` | 48px | 700    |

## Heading

| Token | Size | Weight |
| ----- | ---- | ------ |
| `h1`  | 40px | 700    |
| `h2`  | 32px | 700    |
| `h3`  | 28px | 600    |
| `h4`  | 24px | 600    |
| `h5`  | 20px | 600    |
| `h6`  | 18px | 600    |

## Body

| Token     | Size | Weight |
| --------- | ---- | ------ |
| `body-lg` | 18px | 400    |
| `body-md` | 16px | 400    |
| `body-sm` | 14px | 400    |
| `body-xs` | 12px | 400    |

## Label

| Token      | Size | Weight |
| ---------- | ---- | ------ |
| `label-lg` | 16px | 600    |
| `label-md` | 14px | 600    |
| `label-sm` | 12px | 600    |

---

# Recommended Tailwind Classes

## Heading

```html
<h1 class="text-4xl font-bold text-neutral-900">
<h2 class="text-3xl font-bold text-neutral-900">
<h3 class="text-2xl font-semibold text-neutral-900">
```

## Body

```html
<p class="text-base text-neutral-700 leading-7">
```

## Caption

```html
<span class="text-sm text-neutral-500">
```

---

# Spacing System

Gunakan skala Tailwind default:

| Token | Value |
| ----- | ----- |
| `1`   | 4px   |
| `2`   | 8px   |
| `3`   | 12px  |
| `4`   | 16px  |
| `5`   | 20px  |
| `6`   | 24px  |
| `8`   | 32px  |
| `10`  | 40px  |
| `12`  | 48px  |
| `16`  | 64px  |

---

# Border Radius

| Token | Value |
| ----- | ----- |
| `sm`  | 6px   |
| `md`  | 8px   |
| `lg`  | 12px  |
| `xl`  | 16px  |
| `2xl` | 24px  |

Gunakan:

* Card: `rounded-xl`
* Modal: `rounded-2xl`
* Button: `rounded-lg`

---

# Shadow

## Card

```css
shadow-sm
```

## Elevated

```css
shadow-md
```

## Modal

```css
shadow-xl
```

---

# Button Guidelines

## Primary Button

```html
<button class="bg-primary-700 text-white hover:bg-primary-900 rounded-lg px-4 py-2 font-semibold transition-colors">
```

## Secondary Button

```html
<button class="border border-primary-700 text-primary-700 hover:bg-primary-100 rounded-lg px-4 py-2 font-semibold transition-colors">
```

## Ghost Button

```html
<button class="text-primary-700 hover:bg-primary-100 rounded-lg px-4 py-2 font-semibold transition-colors">
```

---

# Card Guidelines

```html
<div class="rounded-xl border border-neutral-300 bg-white p-6 shadow-sm">
```

---

# Layout Guidelines

## Container

```html
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

## Section

```html
<section class="py-16 lg:py-24">
```

---

# Responsive Typography

## Mobile

* H1: 32px
* H2: 28px
* H3: 24px
* Body: 16px

## Desktop

* H1: 40px
* H2: 32px
* H3: 28px
* Body: 16px

---

# Accessibility

Selalu:

* kontras minimal WCAG AA
* gunakan semantic HTML
* semua gambar memiliki `alt`
* semua input memiliki `label`
* fokus keyboard terlihat jelas

Contoh focus:

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-primary-500
focus-visible:ring-offset-2
```

---

# Dark Mode (Opsional)

Jika menggunakan dark mode:

| Token          | Dark      |
| -------------- | --------- |
| Background     | `#0B1220` |
| Surface        | `#111827` |
| Border         | `#1F2937` |
| Text Primary   | `#F9FAFB` |
| Text Secondary | `#D1D5DB` |

---

# Design Principles

Setiap UI harus:

* sederhana
* konsisten
* mudah dibaca
* cepat dipahami
* mobile-first
* scalable
* reusable
* profesional

Hindari:

* terlalu banyak warna
* terlalu banyak shadow
* animasi berlebihan
* text terlalu kecil
* layout terlalu padat

---

# Final Rule

Jika ragu dalam memilih warna, gunakan:

* Primary: `#2B5AA0`
* Text: `#111827`
* Border: `#D1D5DB`
* Background: `#F9FAFB`

Prinsip utama EGI Media adalah: **Professional, Clean, and Trustworthy**.
