import got, { HTTPError } from 'got';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    await got.post({
      url: 'https://api.dub.co/links',
      searchParams: {
        projectSlug: 'pallyy'
      },
      json: {
        domain: 'dm.new',
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
        throw new Error('Already taken, try another.');
      }
    }
  }
});
