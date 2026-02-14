export function isEmpty(string) {
    return string.trim().length === 0
}

export function isEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}

export function sleep(time) {
    return new Promise((r) => setTimeout(r, time))
}

export async function fetchWithRetries(fn, { signal, retries = 4, onRetry }) {
    const delays = [0, 800, 1600, 3200, 5000]
    let lastError = null
    for (let attempt = 0; attempt <= retries; attempt++) {
        if (signal?.aborted) {
            throw Object.assign(new Error('Aborted'), { name: 'AbortError' })
        }
        if (delays[attempt]) {
            await sleep(delays[attempt])
        }

        try {
            return await fn()
        } catch (e) {
            if (e.name === 'AbortError') throw e
            lastError = e
            if (e?.status !== 503) throw e
            onRetry?.(attempt + 1)
        }
    }
}

export function createClassName(parent, variant, classes) {
    const array = [parent, `${parent}--${variant}`, classes]
        .filter(Boolean)
        .join(' ')
    return array
}
