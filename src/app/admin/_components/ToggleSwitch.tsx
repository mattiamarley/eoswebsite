type Props = {
  name: string
  defaultChecked?: boolean
  label?: string
  labelClassName?: string
}

export function ToggleSwitch({ name, defaultChecked = false, label, labelClassName = 'text-sm font-medium text-ink-soft' }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span className="relative inline-flex items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="block h-6 w-11 rounded-full bg-haze transition-colors peer-checked:bg-lavender peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-lavender" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className={labelClassName}>{label}</span>}
    </label>
  )
}
