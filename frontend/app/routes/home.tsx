import type { Route } from "./+types/home";
import Hello from "../hello/hello";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Hello />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link
          to="/question"
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
  );
}
