/**
 * Pass-through layout component that renders its children unchanged.
 *
 * @param children - React nodes to render inside the layout
 * @returns The rendered children wrapped in a fragment
 */
export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}