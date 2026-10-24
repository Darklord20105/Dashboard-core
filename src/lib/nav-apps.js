// Remove this file when the nav-apps API is removed. Until then, this file is used to fetch the nav-apps from the backend and validate them.

const NAV_APPS_API_URL = '/api/nav-apps'

const isValidNavApp = (value) => {
  if (!value || typeof value !== 'object') return false

  const app = value

  return (
    typeof app.icon === 'string' &&
    typeof app.name === 'string' &&
    typeof app.href === 'string' &&
    (app.openInNewTab === undefined || typeof app.openInNewTab === 'boolean')
  )
}

export const getNavApps = async () => {
  try {
    const response = await fetch(NAV_APPS_API_URL, { cache: 'no-store' })

    if (!response.ok) return []

    const payload = (await response.json())

    if (!Array.isArray(payload)) return []

    const validApps = payload.filter(isValidNavApp)

    return validApps
  } catch {
    return []
  }
}
