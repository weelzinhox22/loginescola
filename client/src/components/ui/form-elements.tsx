import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({
  label,
  error,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface RoleOptionProps {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RoleOption({
  id,
  value,
  label,
  icon,
  checked,
  onChange,
}: RoleOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-muted cursor-pointer transition-all hover:border-primary/50",
        checked && "border-primary bg-primary/5"
      )}
    >
      <input
        type="radio"
        id={id}
        name="role"
        value={value}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
        checked ? "bg-primary text-white" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "font-medium transition-colors",
        checked ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </label>
  );
}
