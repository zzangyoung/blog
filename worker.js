const LIKE_PATH_PREFIX = "/api/like/"

function jsonResponse(body, init) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init && init.headers),
    },
  })
}

function keyForSlug(slug) {
  return "like:" + slug
}

async function handleLikeRequest(request, env, slug) {
  if (!slug) {
    return jsonResponse({ error: "missing slug" }, { status: 400 })
  }

  const key = keyForSlug(slug)

  if (request.method === "GET") {
    const stored = await env.LIKES.get(key)
    const count = stored ? parseInt(stored, 10) : 0
    return jsonResponse({ slug, count: Number.isNaN(count) ? 0 : count })
  }

  if (request.method === "POST") {
    const stored = await env.LIKES.get(key)
    const current = stored ? parseInt(stored, 10) : 0
    const next = (Number.isNaN(current) ? 0 : current) + 1
    await env.LIKES.put(key, String(next))
    return jsonResponse({ slug, count: next })
  }

  return jsonResponse({ error: "method not allowed" }, { status: 405 })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith(LIKE_PATH_PREFIX)) {
      const slug = decodeURIComponent(url.pathname.slice(LIKE_PATH_PREFIX.length))
      return handleLikeRequest(request, env, slug)
    }

    return env.ASSETS.fetch(request)
  },
}
