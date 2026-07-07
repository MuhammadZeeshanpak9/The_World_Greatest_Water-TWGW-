type FormFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "number" | "password" | "textarea" | "select";
  options?: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  tone?: "light" | "dark";
  className?: string;
};

export default function FormField({
  label,
  name,
  type = "text",
  options,
  value,
  onChange,
  placeholder,
  required,
  error,
  rows = 5,
  tone = "light",
  className = "",
}: FormFieldProps) {
  const base =
    "w-full rounded-xl px-4 py-3 font-inter text-[14px] outline-none transition-all duration-300";
  const toneClass =
    tone === "dark"
      ? "glass-card-dark text-white placeholder:text-white/35 input-glow-focus"
      : "glass-card-light text-ink placeholder:text-muted input-glow-focus";

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span
        className={`font-inter text-[11px] font-semibold uppercase tracking-[0.2em] ${
          tone === "dark" ? "text-white/70" : "text-body"
        }`}
      >
        {label}
        {required && <span className="text-violet"> *</span>}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${base} ${toneClass} resize-none`}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`${base} ${toneClass}`}
        >
          <option value="" disabled>
            {placeholder ?? "Select..."}
          </option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`${base} ${toneClass}`}
        />
      )}
      {error && <span className="font-inter text-[12px] text-red-500">{error}</span>}
    </label>
  );
}
