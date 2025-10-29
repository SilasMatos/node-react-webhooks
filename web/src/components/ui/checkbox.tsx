import * as RadixCheckbox from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"




export function Checkbox(props: RadixCheckbox.CheckboxProps) {
  return (
    <RadixCheckbox.Root>
      <RadixCheckbox.Indicator className="flex items-center justify-center text-zinc-900">
<CheckIcon className="size-3 " strokeWidth={3} />
      </RadixCheckbox.Indicator>

    </RadixCheckbox.Root>

  )
}