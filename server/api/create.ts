import got from 'got';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  await got.post({
    url: 'https://api.dub.co/links',
    searchParams: {
      projectSlug: 'pallyy'
    },
    json: {
      domain: 'dm.new',
      url: `https://twitter.com/direct_messages/create/${body.username}`,
      key: body.url
    },
    headers: {
      Authorization: `Bearer ${useRuntimeConfig().dubApiKey}`
    }
  });
});
