import type { ParsedCommand } from './types'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim()
  if (!trimmed) {
    return { raw: escapeHtml(input), command: '', args: [] }
  }

  const parts = trimmed.split(/\s+/)
  const command = escapeHtml(parts[0].toLowerCase())
  const args = parts.slice(1).map(escapeHtml)

  return {
    raw: escapeHtml(trimmed),
    command,
    args,
  }
}
