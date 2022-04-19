---
sidebar_position: 5
---

# Authentication and Authorization

## Summary

SSO service is required for authentication. Telescope doesn't store user information itself, we just send it to Seneca's SSO. From that interaction, Telescope creates a token that will only work for a limited amount of time. The token is used to authenticate various Telescope services without sending requests to Seneca's server every time. The same token system is also used throughout our Supabase backend.

## Stages

_This is what happens step by step in the SSO service:_

- Logging to the Telescope website will send a login request.
- Login data is sent to Seneca's servers.
- Microsoft SAML-2.

  :::info

  See more in [Not so simple SAML](https://blog.humphd.org/not-so-simple-saml/)

  :::

- Auth cookies are returned to SSO service.
- SSO service creates a JWT token, which is basically encrypted JSON data.

### Tokens

_Token includes information such as:_

1. Who issued it (Us - Telescope server)
2. Who the audience is (For whom it is made and works for - Telescope servers)
3. Who is the subject of the token (Some IDs. In our case, a hashed user email)
4. Claims. Data about the user.

### Claims

_Claims include following data:_

1. Email
2. First name
3. Last name
4. Display name (consists of first and last names)
5. Roles

### Roles

_Roles describe permissions for certain actions_

1. Seneca (Authenticated with Seneca SSO user)
2. Telescope (User has a Telescope account)
3. Admin (User is a Telescope admin)
4. Service (User can use protected routes to communicate with another microservice, such as Satellite)

   :::caution Important

   Service role might be deprecated and no longer used. Satellite used to be a a separate repository, now that it isn't - the role might not be needed. It is unclear if it currently exists. Please create an issue to figure out this mystery. After you do - update this information.

   :::

## Proceeding stages

- SSO service signs the token using a JWT secret, making it viable for a limited amount of time.

:::info

JWT is a string that is made up of 3 parts, joined by periods (`.`). Each part is a [`base64url`](https://www.rfc-editor.org/rfc/rfc4648#section-5) string. The original string is a JSON string, transformed through a `base64url` encoder.
In the end, there is a secret which is used to create a cryptographic hash.
You can't modify encrypted data unless you know the secret.
See [JWT](https://jwt.io/introduction) for more info.

:::

- Token is handed back to the browser.
- Browser sends the token in the header to the other service that needs authentication.
- The service checks if the token hasn't expired and confirms it being valid.
- The service then checks the digital signature against the secret.
- Once the authentication information is confirmed to be correct, it sends the requested data back.

:::note

Supabase uses the same JWT secret.

:::
