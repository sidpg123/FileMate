export default function MetricCard({
  value,
  label,
  icon,
  gradient,
  bgGradient,
}: {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
}) {
  return (
    <div className={`relative group  overflow-hidden rounded-xl bg-gradient-to-br ${bgGradient} border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      
      <div className="relative p-3 lg:p-4">
        <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg flex-shrink-0`}>
            {icon}
          </div>
          
          <div className="flex-1 lg:w-full">
            <div className="text-lg lg:text-xl font-black text-slate-800 leading-tight">{value}</div>
            <div className="text-xs font-semibold text-slate-600 leading-tight">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}