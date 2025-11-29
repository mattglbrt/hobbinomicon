# Hobbinomicon Comments API

A Cloudflare Worker with D1 database for managing blog comments.

## Setup Instructions

### 1. Install dependencies

```bash
cd comments-api
npm install
```

### 2. Create the D1 database

```bash
npm run db:create
```

This will output a database ID. Copy it.

### 3. Update wrangler.toml

Edit `wrangler.toml` and paste your database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hobbinomicon-comments"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Paste here
```

### 4. Initialize the database schema

```bash
npm run db:init
```

### 5. Deploy the Worker

```bash
npm run deploy
```

This will output your Worker URL, something like:
`https://hobbinomicon-comments.YOUR_SUBDOMAIN.workers.dev`

### 6. Update your Astro site

Add the Worker URL to your environment variables. Create or update `.env`:

```
PUBLIC_COMMENTS_API_URL=https://hobbinomicon-comments.YOUR_SUBDOMAIN.workers.dev
```

Then redeploy your Astro site.

## API Endpoints

### GET /comments?post_slug=xxx
Get approved comments for a post.

### POST /comments
Submit a new comment. Body:
```json
{
  "post_slug": "my-post",
  "author_name": "John",
  "content": "Great post!",
  "website": ""  // Honeypot - leave empty
}
```

### GET /comments/count?post_slug=xxx
Get comment count for a post.

## Moderation

Comments are unapproved by default. To approve comments:

1. Go to Cloudflare Dashboard > Workers & Pages > hobbinomicon-comments > D1
2. Open the database and run SQL:

```sql
-- View pending comments
SELECT * FROM comments WHERE approved = 0;

-- Approve a comment
UPDATE comments SET approved = 1 WHERE id = X;

-- Delete spam
DELETE FROM comments WHERE id = X;
```

### Auto-approval (optional)

To auto-approve comments, edit `src/index.ts` line ~165:
```ts
0 // Set to 1 if you want auto-approval
```
Change `0` to `1`, then redeploy.

## Local Development

```bash
# Initialize local database
npm run db:init:local

# Start dev server
npm run dev
```

## Security Features

- Rate limiting: 5 comments per IP per hour
- Honeypot field to catch bots
- Input validation and sanitization
- XSS prevention via HTML escaping
- IP hashing (privacy-preserving)
- CORS restricted to your domain
