export async function fetchURL(url) {
  const response = await fetch(url)

  return await response.json()
}
