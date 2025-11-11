import Navbar from "@/components/navbar";

/**
 * Layout that renders the workspace Navbar and displays `children` beneath it.
 *
 * @param children - Content to render inside the layout, displayed after the Navbar.
 * @returns The rendered layout containing the Navbar followed by `children`.
 */
export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}