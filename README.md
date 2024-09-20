<h1 align="center">
 AIMS Tagging Node
</h1>

<div align="center">
  A Node.js library written in TypeScript to integrate the AIMS Tagging API.
  <br /> You MAY USE this library on the client as well as on the server side.
  <br />
  <br />
  Reach for more information at <a href="https://aimsapi.com">aimsapi.com</a>
  <br />
  <br />
  <a href="https://github.com/aims-api/aims-tagging-node/issues/new">Report a Bug</a>
  -
  <a href="https://github.com/aims-api/aims-tagging-node/issues/new">Request a Feature</a>
  -
  <a href="mailto:hello@aimsapi.com">Ask a Question</a>
</div>
  <br />

<div align="center">
<a href="https://aimsapi.com" rel="nofollow" target="_blank"><img src="https://img.shields.io/badge/created%20by-AIMS%20API-8137CF" alt="Created by AIMS API"></a>
<a href="https://www.npmjs.com/package/@aims-api/aims-tagging-node" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@aims-api/aims-tagging-node.svg" alt="NPM version" /></a></span>
</div>

<details open="open">
<summary><h2>Table of Contents</h2></summary>

- [Getting Started](#getting-started)
  - [Authentication](#authentication)
  - [Next.js example](#example-with-nextjs)
- [Usage](#usage)
  - [Routes](#routes)
  - [Response Structure](#response-structure)
- [License](#license)

</details>

---

<details open="open">
<summary>

## Getting Started

</summary>

<br />
To work with the package you need to have npm (or other package manager) installed.
Library supports Node.js version 18 and above, and can be used in a client codebase.
<br />
<br />

```
npm install @aims-api/aims-tagging-node
```

### Authentication

In order to use the lirbary you need to obtain credentials by contacting us at [hello@aimsapi.com](mailto:hello@aimsapi.com). Credentials consist of CLIENT_ID, CLIENT_SECRET, LOGIN and PASSWORD.

<details open="open">
<summary>

### Example with Next.js

</summary>

To access protected routes you need to authenticate in order to get a time-limited token. You need to use this token while creating a client instance.

```typescript
// pages/api/authenticate.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { Client as TaggingApiClient } from '@aims-api/aims-tagging-node'

export const createClient = async (req: NextApiRequest) => {
  const { clientId, clientSecret } = await getSiteConfigForRequest(req)
  const apiUserToken = getTokenFromCookie(req)
  return new TaggingApiClient({
    apiHost: 'HOST_URL', // optional
    clientId: 'YOUR_CLIENT_ID', // required
    clientSecret: 'YOUR_CLIENT_SECRET', // required
    apiUserToken: JSON.parse(req.cookies.auth_token), // you can get this from local storage as well, "authenticate" request does not require this field
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { userEmail, userPassword } = req.body
      const aimsClient = createClient(req)
      const response = await aimsClient.endpoints.authentication.authenticate({
        userEmail,
        userPassword,
      })

      const { token, ...rest } = response // removes token from the response to hide from the client-side code (optional)
      return
      res
        .setHeader(
          'Set-Cookie',
          `auth_token=${JSON.stringify(response.token)}; HttpOnly; Secure; path=/`,
        ) // sets token to cookie (optional)
        .status(200)
        .json(rest)
    } catch (error) {
      console.warn(error)
    }
  }
  return res.status(400).json('Method not allowed')
}

export default handler
```

</details>

## Usage

It is common to make a proxy request from client app to the server in order to hide foreign URL.

When you create a client instance in your codebase, you can then easily access all the existing endpoints via IDE autocomplete, as well as the required and optional parameters.

#### TypeScript

Library is written in TypeScript, therefore you can use input / response types that are provided in every endpoint file.

Example

```typescript
// src/types/index.ts

type Track = Partial<{
  id: string
  title: string
  tags: Tags | null
  filesize: number | null
  duration: number | null
  processedAt: DateTime | null
  hookUrl: string | null
  modelVersion: string
  queuedAt: DateTime | null
  batchId: string | null
}>
```

### Routes

The library provides a set of endpoints that can be found in [src/client/index.ts](/src/client/index.ts#L175) file by the `endpoints` property on line #175.

### Response Structure

Responses are not validated by this library, therefore you need to parse the structure on your own, referring to provided response types. If you find any incosistency, please open an issue or contact us via email.

This library uses Axios under the hood to make requests, so any network error will be of type `AxiosError`. Please, check [Axios documentation](https://axios-http.com/docs/handling_errors) for more information.

Example of parsing error with [zod](https://github.com/colinhacks/zod) on the client side:

```typescript
// src/helpers/response.ts

import { z } from 'zod'
import { isAxiosError } from 'axios'

interface CustomError {
  status: number | null
  message: string
  field?: string
}

const errorSchema = z.object({
  status: z.number(),
  message: z.string(),
  field: z.optional(z.string()),
})

const notParsed: CustomError = {
  status: 500,
  message: 'Not able to parse error',
}

export const parseError = (error: unknown) => {
  if (isAxiosError(error) && error.response !== undefined) {
    const errorParserResponse = errorSchema.safeParse(error.response.data)
    if (!errorParserResponse.success) {
      return notParsed
    }
    return errorParserResponse.data
  }
  return notParsed
}
```

## License

See [LICENSE](LICENSE) for more information.
