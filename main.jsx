import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import LandingPage from "./LandingPage.jsx";
import DeelDesignSystemIndex from "./Index.jsx";

function App() {
  const [view, setView] = useState("landing");
  const [targetComponent, setTargetComponent] = useState(null);
  const [dark, setDark] = useState(true);

  function handleLaunchDemo(component = null) {
    setTargetComponent(component);
    setView("playground");
    window.scrollTo(0, 0);
  }

  if (view === "playground") {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setView("landing"); window.scrollTo(0, 0); }}
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px 5px 8px",
            borderRadius: 20,
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#7C3AED",
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(124,58,237,0.2)";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(124,58,237,0.12)";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
          }}
        >
          ← Overview
        </button>
        <DeelDesignSystemIndex initialComponent={targetComponent} dark={dark} setDark={setDark} />
      </div>
    );
  }

  return <LandingPage onLaunchDemo={handleLaunchDemo} dark={dark} onToggleDark={() => setDark(d => !d)} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
