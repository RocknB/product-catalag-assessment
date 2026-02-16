interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      {children}
    </div>
  );
}
