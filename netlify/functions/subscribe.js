export default async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, name } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_LIST = process.env.MAILGUN_LIST;

    if (!MAILGUN_API_KEY || !MAILGUN_LIST) {
      console.error('Missing Mailgun environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add member to Mailgun mailing list
    const params = new URLSearchParams();
    params.append('address', email);
    params.append('subscribed', 'yes');
    if (name) params.append('name', name);

    const response = await fetch(
      `https://api.mailgun.net/v3/lists/${MAILGUN_LIST}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`api:${MAILGUN_API_KEY}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Mailgun returns 400 if already subscribed
      if (response.status === 400 && data.message?.includes('Address already exists')) {
        return new Response(JSON.stringify({ message: 'You are already subscribed!' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.error('Mailgun error:', data);
      return new Response(JSON.stringify({ error: 'Failed to subscribe. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Successfully subscribed!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/subscribe',
};
