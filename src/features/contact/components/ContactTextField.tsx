const fieldClass =
  "w-full rounded-none border border-neutral-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-600";

interface ContactTextFieldProps {
  autoComplete?: string;
  disabled: boolean;
  id: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  value: string;
}

export function ContactTextField({
  autoComplete,
  disabled,
  id,
  label,
  name,
  onChange,
  type = "text",
  value,
}: ContactTextFieldProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className={fieldClass}
        disabled={disabled}
        id={id}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </div>
  );
}
