import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-[var(--brand-platinum)] prose-p:text-[var(--brand-muted)] prose-a:text-[var(--brand-clay)] prose-strong:text-[var(--brand-platinum)] prose-code:text-[var(--brand-clay)] prose-pre:bg-[var(--brand-onyx)] prose-pre:border prose-pre:border-[var(--brand-border)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
