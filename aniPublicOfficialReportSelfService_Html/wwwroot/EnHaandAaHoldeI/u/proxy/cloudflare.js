// edge proxy takes client request, mutate and send to target, return response to client
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
    const url = new URL(request.url)

    // Bytt target
    url.hostname = "api.target.com"

    // Forward request
    return fetch(url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
  }
}
