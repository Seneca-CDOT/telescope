---
sidebar_position: 9
---

# Supabase

Telescope uses Supabase, an open-source Firebase alternative, to store user and feeds tables, and handle authorization.

## Environment Variables

### JWT_SECRET

- We use a `JWT_SECRET` (shared between SSO and Supabase) to sign the user info and send back the token to the client
- The client calls `supabase.auth.setAuth(token)`. Because the `JWT_Secret` is shared between SSO and Supabase, the user is authenticated.
- With Supabase, we can add a policy that looks at `request.jwt.roles` or `request.jwt.id` to determine if they are allowed to do something with the database.

### ANON_KEY

- This key is used to bypass the Supabase API gateway and can be used in your client-side code.
- We use it to initialize the Supabase client in the front-end
