"use client";

import React, { useState } from "react";

export default function Hello() {
  const [message, setMessage] = useState("");

  const handleShowHello = () => {
    setMessage("hello");
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Next.jsでHello!</h1>

      <button onClick={handleShowHello}>helloを表示する</button>

      {message && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{message}</p>
        </div>
      )}
    </div>
  );
}
