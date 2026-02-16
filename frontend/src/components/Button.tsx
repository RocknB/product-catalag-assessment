import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "grey";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-green-900 hover:bg-green-800 text-white font-semibold",
    grey: "bg-gray-200 hover:bg-gray-300 text-gray-700",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
