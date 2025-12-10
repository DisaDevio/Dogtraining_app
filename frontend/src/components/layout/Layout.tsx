import type { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="image-container">
      <img
        className="img"
        src="/background.png"
        alt="Hertha running"
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          borderRadius: "10px",
          zIndex: 0,
          top: 0,
          left: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "100%",
          height: "calc(100vh - 40px)",
          backgroundColor: "rgba(87, 91, 58, 0.9)",
          borderRadius: "20px",
          margin: "20px",
        }}
      >
        <Navigation />
        <div
          style={{
            flexGrow: 1,
            padding: "10px",
            zIndex: 4,
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
