# User Management Dashboard

React app for managing users — list, search, filter, create, edit, and delete users.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (included with Node.js)

Check your versions:

```bash
node -v
npm -v
```

## Setup

1. Open the project folder and go into the app directory:

```bash
cd User
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

4. Optional: edit `.env` if you want to use a different API:

```env
VITE_API_BASE_URL=https://dummyjson.com
```

## Run

### Development

Start the dev server:

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Production build

Build the app:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Troubleshooting

- **Port already in use:** Stop the other app using port 5173, or run `npm run dev -- --port 3000`.
- **Install errors:** Delete `node_modules` and run `npm install` again.
- **API errors:** Make sure `.env` exists and `VITE_API_BASE_URL` is set correctly.
