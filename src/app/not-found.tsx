import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="shell not-found">
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link href="/">Back to the portfolio</Link>
    </main>
  );
}
