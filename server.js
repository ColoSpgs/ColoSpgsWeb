const server = Bun.serve({
  port: 8000,
  fetch(req) {
    const url = new URL(req.url)
    let path = url.pathname

    // Serve index.html for the root path
    if (path === '/') path = '/index.html'

    // Adjust this path to match your project structure
    const filePath = `./public${path}`

    try {
      const file = Bun.file(filePath)
      return new Response(file)
    } catch (error) {
      console.error(`Error serving ${filePath}:`, error)
      return new Response('Not Found', { status: 404 })
    }
  },
})

console.log(`Listening on http://localhost:${server.port}`)
