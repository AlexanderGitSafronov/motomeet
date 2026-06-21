/**
 * Share via the Web Share API when available, otherwise copy the URL to the
 * clipboard. Returns a short status used to show the right toast.
 */
export async function share(data: {
  title: string
  text?: string
  url?: string
}): Promise<'shared' | 'copied' | 'failed'> {
  const nav: Navigator | undefined = typeof navigator !== 'undefined' ? navigator : undefined
  const url = data.url ?? (typeof window !== 'undefined' ? window.location.href : '')
  try {
    if (nav && typeof nav.share === 'function') {
      await nav.share({ title: data.title, text: data.text, url })
      return 'shared'
    }
    if (nav && nav.clipboard) {
      await nav.clipboard.writeText(url)
      return 'copied'
    }
    return 'failed'
  } catch {
    return 'failed'
  }
}
