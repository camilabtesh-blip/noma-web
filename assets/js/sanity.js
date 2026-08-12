// Config y helper para leer datos desde Sanity (CMS).
const SANITY_PROJECT_ID = 'xz8a6oqx';
const SANITY_DATASET = 'production';

function sanityQuery(groq, params) {
  const base = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}`;
  const url = new URL(base);
  url.searchParams.set('query', groq);
  if (params) {
    Object.keys(params).forEach((key) => {
      url.searchParams.set('$' + key, JSON.stringify(params[key]));
    });
  }
  return fetch(url.toString())
    .then((r) => r.json())
    .then((json) => json.result);
}

function sanityImageUrl(url, width) {
  if (!url) return '';
  return `${url}?w=${width || 1600}&auto=format`;
}
