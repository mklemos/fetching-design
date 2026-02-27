export interface ParsedCommand {
  raw: string
  command: string
  args: string[]
}

export type OutputType = 'input' | 'output' | 'error' | 'info' | 'success' | 'accent'

export interface OutputSegment {
  type: OutputType
  text: string
}

export interface OutputLine {
  type: OutputType
  text: string
  segments?: OutputSegment[]
}

export interface CommandOutput {
  lines: OutputLine[]
  navigate?: string
  clear?: boolean
}

export type CommandHandler = (args: string[]) => CommandOutput

export type TerminalMode = 'hero' | 'fab' | 'overlay'
