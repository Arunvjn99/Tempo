import type { ReactNode } from "react";

export interface V2SectionProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function V2Section({ title, subtitle, children, className = "" }: V2SectionProps) {
  return (
    <section className={`v2-section ${className}`.trim()}>
      {title != null ? <h3 className="v2-section__title">{title}</h3> : null}
      {subtitle != null ? <p className="v2-section__subtitle">{subtitle}</p> : null}
      <div className="v2-section__stack">{children}</div>
    </section>
  );
}
