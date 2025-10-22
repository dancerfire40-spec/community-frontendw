const POSTS_KEY = 'demo_posts_v1'

export async function getPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    if (!raw) {
      const seed = [{ id: 1, title: 'Welcome', body: 'This is a sample community post.' }]
      localStorage.setItem(POSTS_KEY, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export async function createPost(payload) {
  const posts = await getPosts()
  const next = { id: Date.now(), title: payload.title, body: payload.body }
  posts.unshift(next)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return next
}

export default { getPosts, createPost }
