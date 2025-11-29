/**
 * Hobbinomicon Comments API
 * Cloudflare Worker with D1 database for blog comments
 */

interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
}

interface Comment {
  id: number;
  post_slug: string;
  author_name: string;
  content: string;
  created_at: string;
  approved: number;
  parent_id: number | null;
}

// Simple hash function for IP addresses (privacy-preserving)
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'hobbinomicon-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

// CORS headers
function corsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  const isAllowed = origin === allowedOrigin || allowedOrigin === '*' || origin?.includes('localhost');
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Rate limiting check (5 comments per hour per IP)
async function checkRateLimit(db: D1Database, ipHash: string): Promise<boolean> {
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Clean old entries
  await db.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(hourAgo).run();

  // Check current count
  const result = await db.prepare(
    'SELECT count FROM rate_limits WHERE ip_hash = ? AND window_start > ?'
  ).bind(ipHash, hourAgo).first<{ count: number }>();

  if (result && result.count >= 5) {
    return false; // Rate limited
  }

  // Update or insert rate limit entry
  if (result) {
    await db.prepare('UPDATE rate_limits SET count = count + 1 WHERE ip_hash = ?').bind(ipHash).run();
  } else {
    await db.prepare('INSERT INTO rate_limits (ip_hash, count, window_start) VALUES (?, 1, datetime("now"))').bind(ipHash).run();
  }

  return true;
}

// Sanitize input to prevent XSS
function sanitize(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Validate comment input
function validateComment(data: any): { valid: boolean; error?: string } {
  if (!data.post_slug || typeof data.post_slug !== 'string') {
    return { valid: false, error: 'Missing post_slug' };
  }
  if (!data.author_name || typeof data.author_name !== 'string' || data.author_name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (data.author_name.length > 100) {
    return { valid: false, error: 'Name too long (max 100 characters)' };
  }
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length < 3) {
    return { valid: false, error: 'Comment must be at least 3 characters' };
  }
  if (data.content.length > 5000) {
    return { valid: false, error: 'Comment too long (max 5000 characters)' };
  }
  // Honeypot check
  if (data.website && data.website.trim() !== '') {
    return { valid: false, error: 'Bot detected' };
  }
  return { valid: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    try {
      // GET /comments?post_slug=xxx - Get approved comments for a post
      if (request.method === 'GET' && url.pathname === '/comments') {
        const postSlug = url.searchParams.get('post_slug');

        if (!postSlug) {
          return new Response(JSON.stringify({ error: 'Missing post_slug parameter' }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        const comments = await env.DB.prepare(`
          SELECT id, post_slug, author_name, content, created_at, parent_id
          FROM comments
          WHERE post_slug = ? AND approved = 1
          ORDER BY created_at ASC
        `).bind(postSlug).all<Comment>();

        return new Response(JSON.stringify({ comments: comments.results }), {
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // POST /comments - Submit a new comment
      if (request.method === 'POST' && url.pathname === '/comments') {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const ipHash = await hashIP(ip);

        // Check rate limit
        const allowed = await checkRateLimit(env.DB, ipHash);
        if (!allowed) {
          return new Response(JSON.stringify({ error: 'Too many comments. Please wait an hour.' }), {
            status: 429,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        let data: any;
        try {
          data = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        // Validate input
        const validation = validateComment(data);
        if (!validation.valid) {
          return new Response(JSON.stringify({ error: validation.error }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        // Insert comment (unapproved by default for moderation)
        const result = await env.DB.prepare(`
          INSERT INTO comments (post_slug, author_name, content, ip_hash, parent_id, approved)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          sanitize(data.post_slug),
          sanitize(data.author_name),
          sanitize(data.content),
          ipHash,
          data.parent_id || null,
          0 // Set to 1 if you want auto-approval
        ).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Comment submitted for moderation',
          id: result.meta.last_row_id
        }), {
          status: 201,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // GET /comments/count?post_slug=xxx - Get comment count for a post
      if (request.method === 'GET' && url.pathname === '/comments/count') {
        const postSlug = url.searchParams.get('post_slug');

        if (!postSlug) {
          return new Response(JSON.stringify({ error: 'Missing post_slug parameter' }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        const result = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM comments WHERE post_slug = ? AND approved = 1'
        ).bind(postSlug).first<{ count: number }>();

        return new Response(JSON.stringify({ count: result?.count || 0 }), {
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
