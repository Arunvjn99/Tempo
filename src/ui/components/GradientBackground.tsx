/**
 * RetireWise pre-enrollment marketing background — exact layers from AI Studio reference.
 */
export function GradientBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-white -z-20" />
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_center,#DCE8FF_0%,#EAF2FF_50%,transparent_100%)] opacity-50 blur-[120px] -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_20%,transparent_100%)] opacity-20 -z-10" />
    </>
  );
}
