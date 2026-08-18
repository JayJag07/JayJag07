/** Constrói o link de contacto directo via WhatsApp. */

export function whatsappLink(phone, title) {
  const digits = String(phone || '').replace(/\D/g, '')
  const message = `Olá, vi o imóvel ${title} no JETCASA e gostaria de mais informações`
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** +244 923 000 111 a partir de "244923000111" */
export function formatPhone(phone) {
  const d = String(phone || '').replace(/\D/g, '')
  if (d.length < 12) return phone
  return `+${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
}
