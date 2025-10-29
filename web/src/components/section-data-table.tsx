import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface SectionDataTableProps extends HTMLAttributes<HTMLDivElement> {
  data: Array<{ key: string; value: string }>;
}

export function SectionDataTable({ className, data, ...props }: SectionDataTableProps) {
  return(
    <div className={twMerge("border overflow-hidden rounded-lg border-zinc-700", className)} {...props}>
      <table className='w-full '> 
        {data.map((item) => (
          <tr key={item.key} className='border-b border-zinc-700 last:border-0'>
            <td className='p-3 text-sm font-medium text-zinc-400 bg-zinc-800/50 border-r border-zinc-700'>{item.key}</td>
            <td className='p-3 text-zinc-200 text-sm font-mono'>{item.value}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}