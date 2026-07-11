import katex from "katex";

export function MathTex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    output: "html",
  });
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
