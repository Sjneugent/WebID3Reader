Express.js Web Server + AJAX = Uploading files for now

## Running the server

### JavaScript (original)
```bash
node bin/www
```

### TypeScript
```bash
# Development with TypeScript (using ts-node)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run compiled JavaScript
npm run start:ts
```

## TypeScript Setup

This project now supports TypeScript! The TypeScript source files are located in:
- `src/` - TypeScript classes (converted from `js/`)
- `routes/` - Express route handlers (TypeScript)
- `app.ts` - Main application file
- `bin/www.ts` - Server entry point

### Available npm scripts:
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run with ts-node (development)
- `npm run start:ts` - Build and run compiled JavaScript
- `npm start` - Run original JavaScript version

### TypeScript Configuration
The project uses `tsconfig.json` with:
- Target: ES2020
- Module: CommonJS
- Strict type checking enabled
- Source maps and declarations generated
- Output directory: `dist/`