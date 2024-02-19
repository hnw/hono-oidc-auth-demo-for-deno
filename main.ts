import { Hono } from 'npm:hono'
import { serveStatic } from 'npm:hono/deno'
import { oidcAuthMiddleware, getAuth, revokeSession } from 'npm:@hono/oidc-auth';

const app = new Hono()

app.get('/logout', async (c) => {
  await revokeSession(c)
  return c.text('You have been successfully logged out!')
})
app.use('*', oidcAuthMiddleware())
app.use('*', async (c, next) => {
  // Authorize user with email address
  const auth = await getAuth(c)
  if (!auth?.email.endsWith('@gmail.com')) {
    return c.text('Unauthorized', 401)
  }
  await next()
})

app.use('*', serveStatic({ root: 'public/' }))

Deno.serve(app.fetch)
