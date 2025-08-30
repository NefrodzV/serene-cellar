export function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function keysToCamel(row) {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [toCamel(k), v])
  )
}

export function arrayKeysToCamel(rows) {
  return rows.map(keysToCamel)
}

export function camelize(value) {
  if (Array.isArray(value)) {
    return value.map(camelize)
  } else if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [toCamel(k), camelize(v)])
    )
  }

  return value
}
