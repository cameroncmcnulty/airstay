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
      <div className="relative h-[26vh] min-h-[160px] max-h-[220px] overflow-hidden sm:h-[30vh] sm:min-h-[200px] sm:max-h-[260px]">
        <HeroMedia compact />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-12 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100 sm:text-xs">{kicker}</p>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl md:text-4xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/75 sm:text-base">{subtitle}</p>
        </div>
      </div>
      <div className="relative z-20 mx-auto -mt-8 max-w-6xl px-3 text-navy sm:-mt-10 sm:px-4">{children}</div>
    </section>
  );
}
