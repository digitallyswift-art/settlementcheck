import { Resend } from 'resend'

let _resend: Resend | null = null

function getResendClient(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY || 're_dummy_key_for_build'
    _resend = new Resend(key)
  }
  return _resend
}

export const resend = new Proxy({} as Resend, {
  get(_, prop: string | symbol) {
    const client = getResendClient()
    const value = (client as any)[prop as string]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
