import { HeroMedia } from "./HeroMedia";

export function CategoryHero({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      <div className="relative h-[38vh] min-h-[220px] overflow-hidden sm:h-[44vh] sm:min-h-[280px]">
        <HeroMedia compact />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 pt-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100 sm:text-xs">{kicker}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">{subtitle}</p>
        </div>
      </div>
      <div className="relative z-20 mx-auto -mt-10 max-w-6xl px-3 text-navy sm:-mt-12 sm:px-4">
        <div className="rounded-[1.7rem] bg-white p-3 shadow-card ring-1 ring-navy/5 sm:p-5">{children}</div>
      </div>
    </section>
  );
}
