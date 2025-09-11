export function toLocalInputValue(date) {
  // yyyy-MM-ddThh:mm (local)
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${y}-${m}-${d}T${h}:${mm}`
}
