// App.tsx
import { useEffect, useState } from "react";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (url: string) => {
    history.pushState(null, "", url);
    setPath(url);
  };

  return (
    <div>
      <nav>
        <button onClick={() => navigate("/")}>홈</button>
        <button onClick={() => navigate("/about")}>소개</button>
      </nav>

      <main style={{ marginTop: "40px" }}>
        {path === "/" && (
          <div>
            <h1 style={{ fontSize: "32px" }}>홈 페이지입니다</h1>
          </div>
        )}

        {path === "/about" && (
          <div>
            <h1 style={{ fontSize: "32px" }}>소개 페이지입니다</h1>
          </div>
        )}

        {path !== "/" && path !== "/about" && (
          <div>
            <h1 style={{ fontSize: "32px" }}>404 Not Found</h1>
          </div>
        )}
      </main>
    </div>
  );
}
