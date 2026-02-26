export interface ParsedCommand {
  raw: string
  command: string
  args: string[]
}

export interface OutputLine {
  type: 'input' | 'output' | 'error' | 'info'
  text: string
}

export interface CommandOutput {
  lines: OutputLine[]
  navigate?: string
  clear?: boolean
}

export type CommandHandler = (args: string[]) => CommandOutput

export type TerminalMode = 'hero' | 'fab' | 'overlay'
