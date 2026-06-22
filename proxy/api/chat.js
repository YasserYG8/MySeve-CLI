export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/plain; charset=utf-8',
  };

  // Handle preflight options request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Missing or invalid messages array', { status: 400, headers });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response('API Key configuration error on proxy server', { status: 500, headers });
    }

    // Call OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/YasserYG8/MySeve-CLI',
        'X-Title': 'Yasser Gombra Terminal CV',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: messages,
        stream: true,
      }),
    });

    if (!openRouterResponse.ok) {
      const errText = await openRouterResponse.text();
      return new Response(`OpenRouter error: ${errText}`, { status: openRouterResponse.status, headers });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Setup streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterResponse.body.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Hold onto unfinished line

            for (const line of lines) {
              const cleanLine = line.trim();
              if (cleanLine.startsWith('data: ')) {
                const dataStr = cleanLine.slice(6);
                if (dataStr === '[DONE]') continue;
                try {
                  const json = JSON.parse(dataStr);
                  const text = json.choices[0]?.delta?.content || '';
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  // Ignore parsing errors for empty/keep-alive SSE lines
                }
              }
            }
          }
        } catch (streamErr) {
          controller.error(streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers });
  } catch (err) {
    return new Response(`Server error: ${err.message}`, { status: 500, headers });
  }
}
