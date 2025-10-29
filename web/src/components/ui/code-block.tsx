import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

interface CodeBlockProps extends ComponentProps<'div'> {
  code: string,
  language?: string,
}

export function CodeBlock({ code, language = 'json', className, ...props }: CodeBlockProps) {
  const [parsedCode, setParsedCode] = useState('')

  useEffect(() => {
    if (code) {
      codeToHtml(code, {
        lang: language,
        theme: 'vesper'
      }).then((html) => {
        setParsedCode(html)
      }).catch((error) => {
        console.error('Error parsing code:', error)
        setParsedCode(`<pre><code>${code}</code></pre>`)
      })
    }
  }, [code, language])

  return (
    <div className={twMerge('relative rounded-lg border border-zinc-700 overflow-x-auto', className)} {...props}>
      <div className="[&_pre]:p-4  [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedCode }} />
    </div>
  )
}