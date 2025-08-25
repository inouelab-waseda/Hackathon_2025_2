import Hello from "@/components/Hello";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Hello />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            href="/question"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#667eea",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            アキネーター風質問を始める
          </Link>
        </div>
      </div>
    </main>
  );
}
