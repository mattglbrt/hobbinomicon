export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const MAILGUN_API_KEY = import.meta.env.MAILGUN_API_KEY;
  const MAILGUN_DOMAIN = import.meta.env.MAILGUN_DOMAIN;
  const MAILGUN_LIST = import.meta.env.MAILGUN_LIST;

  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !MAILGUN_LIST) {
    return new Response(
      JSON.stringify({ error: 'Newsletter service is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = body.email?.trim();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: 'Please provide a valid email address.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = new URLSearchParams();
    formData.append('subscribed', 'true');
    formData.append('address', email);

    const response = await fetch(
      `https://api.mailgun.net/v3/lists/${MAILGUN_LIST}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (response.ok) {
      return new Response(
        JSON.stringify({ message: 'Successfully subscribed! Welcome aboard.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    // Mailgun returns 400 with "Address already exists" for duplicates
    if (response.status === 400 && data.message?.includes('already exists')) {
      return new Response(
        JSON.stringify({ message: "You're already subscribed!" }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Could not subscribe. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Could not subscribe. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
