import got, { HTTPError } from 'got';
import { object, string } from 'yup';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    async (body) => await object({
      url: string().required('Url is required').min(3, 'Url must be at least 3 characters. Send Tim a dm to claim a shorter'),
      username: string().required('Your X Username is required')
    }).validate(body)
  );

  try {
    await got.post({
      url: 'https://api.dub.co/links',
      searchParams: {
        projectSlug: 'pallyy'
      },
      json: {
        url: `https://twitter.com/direct_messages/create/${body.username}`,
        key: body.url,
        publicStats: true
      },
      headers: {
        Authorization: `Bearer ${useRuntimeConfig().dubApiKey}`
      }
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      if (err.response.statusCode === 409) {
        throw createError({ statusCode: 409, message: 'Username already taken, try another.' });
      }
    }
  }
});
