// edge proxy takes client request, mutate and send to target, return response to client

// Serverless edge proxy for CORS bypass and hostname mutation, deployed on Cloudflare Workers
// A) Get URL and Key from parameters a=api.target.com/path&k=key123 and push rest of parameters to API...
// B) Call host a with same path and query parameters except a and k, add api-key unscrambled in header
// C) Return reply to client with CORS headers
// D) Log to supabase

// Deployment instructions:
// 1. Install Wrangler CLI: npm install -g wrangler
// 2. Authenticate: wrangler login
// 3. Create a new Worker: wrangler init my-worker
// 4. Replace the generated index.js with the above code
// 5. Deploy: wrangler publish --name cloudflare-proxy --env production 
// 6. Update DNS to point to the Worker (e.g., via a CNAME record)


// Code to be deployed on Cloudflare Workers
export default {
  async fetch(request) {
    // 0. Get URL and Key from parameters a=api.target.com/path&k=key123 and push rest of parameters to API...
    const params = new URL(request.url).searchParams;
    const a = params.get("a");
    const k = params.get("k");
    if (!a || !k) {
      return new Response("Missing 'a' or 'k' parameter", { status: 400 });
    }
    
    // Construct target URL from 'a'
    const targetUrl = new URL(a);
    
    // Add remaining query parameters (excluding 'a' and 'k')
    for (let [key, value] of params) {
      if (key !== 'a' && key !== 'k') {
        targetUrl.searchParams.set(key, value);
      }
    }
    
    // Unscramble the key (assuming base64 encoded)
    const apiKey = atob(k);
    
    // Create new headers with the api-key
    const newHeaders = new Headers(request.headers);
    newHeaders.set('api-key', apiKey);
    
    // 2. Handle Preflight (OPTIONS) requests from browser
    if (request.method === "OPTIONS") { 
      return new Response(null, { headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*",
          "Access-Control-Max-Age": "86400",
        },});}    
    
    // 3. Forward request to target
    let response = await fetch(targetUrl, { method: request.method, headers: newHeaders, body: request.body });
    
    // D) Log to supabase (placeholder - replace with actual supabase integration)
    // const supabaseUrl = 'https://your-project.supabase.co';
    // const supabaseKey = 'your-anon-key';
    // await fetch(`${supabaseUrl}/rest/v1/logs`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${supabaseKey}`,
    //   },
    //   body: JSON.stringify({ request: request.url, target: targetUrl.toString(), status: response.status }),
    // });
    
    // 4. Clone response, inject CORS, send to client
    const corsResponse = new Response(response.body, response);
    corsResponse.headers.set("Access-Control-Allow-Origin", "*");  
    return corsResponse;
  }
}
