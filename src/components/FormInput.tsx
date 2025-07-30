import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormInputProps {
  label: string;
  type?: 'text' | 'url' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className,
  maxLength,
}: FormInputProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-2', className)}
    >
      <Label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            'min-h-[100px] sm:min-h-[120px] resize-y rounded-xl border-gray-300 focus:border-gray-600 focus:ring-gray-600 bg-white/80 text-gray-900 placeholder-gray-500 shadow-sm',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400'
          )}
        />
      ) : (
        <Input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            'rounded-xl border-gray-300 focus:border-gray-600 focus:ring-gray-600 bg-white/80 text-gray-900 placeholder-gray-500 shadow-sm',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400'
          )}
        />
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 font-medium"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}