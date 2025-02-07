import { cva } from 'class-variance-authority';

// ----------------------------------------------------------------------

export const buttonStyles = cva('button', {
  variants: {
    variant: {
      filled: [
        'cursor-pointer',
        'bg-primary-1',
        'rounded-md',
        'px-4',
        'py-2',
        'font-poppins',
        'text-base',
        'font-semibold',
        'text-white',
        'shadow-none',
        'shadow-primary-1/50',
        'transition-all',
        'duration-300',
        'hover:bg-primary-1/80',
        'active:scale-95',
        'disabled:cursor-not-allowed',
        'disabled:bg-[#555B69]',
        'disabled:shadow-[#555B69]/50',
        'disabled:active:scale-100',
      ],
      outlined: [
        'cursor-pointer',
        'border',
        'border-primary-1',
        'rounded-md',
        'px-4',
        'py-2',
        'font-poppins',
        'text-base',
        'font-semibold',
        'text-primary-1',
        'shadow-none',
        'transition-all',
        'duration-300',
        'hover:border-primary-1/80',
        'active:scale-95',
        'disabled:cursor-not-allowed',
        'disabled:border-[#555B69]',
        'disabled:text-[#555B69]',
        'disabled:active:scale-100',
      ],
      gost: [
        'cursor-pointer',
        'font-poppins',
        'text-base',
        'font-semibold',
        'text-primary-1',
        'transition-all',
        'duration-300',
        'active:scale-95',
        'disabled:cursor-not-allowed',
        'disabled:text-[#555B69]',
        'disabled:active:scale-100',
      ],
    },
    fullWidth: {
      true: ['w-full'],
      false: ['w-fit'],
    },
    shadow: {
      true: ['shadow-lg'],
      false: ['shadow-none'],
    },
  },
  defaultVariants: {
    variant: 'filled',
    fullWidth: false,
    shadow: false,
  },
});
