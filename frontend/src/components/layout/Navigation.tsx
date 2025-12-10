import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div
      style={{
        width: "200px",
        padding: "20px",
        minWidth: "200px",
        borderRight: "1px solid rgba(255,255,255,0.3)",
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: "20px 0 0 20px",
        zIndex: 3,
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>Meny</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/">Hem</Link>
        </li>
        <li>
          <Link to="/jaktdagbok">Översikt</Link>
        </li>
        <li>
          <Link to="/jaktdagbok/graphs">Statistik</Link>
        </li>
        <li>
          <Link to="/jaktdagbok/hunts">Jakttillfällen</Link>
        </li>
        <li>
          <Link to="/jaktdagbok/learning-curve">Lärmoment</Link>
        </li>
        <li style={{ marginBottom: "20px", zIndex: 3 }}>
          <Link to="/jaktdagbok/map">Viltkarta</Link>
        </li>
      </ul>
      <div
        style={{
          position: "relative",
          bottom: "0px",
          left: "0px",
          marginTop: "90px",
          flexDirection: "row",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginLeft: "-100px",
          zIndex: 1,
        }}
      >
        <img
          src="/hertha-figure.png"
          alt="Hertha"
          style={{
            scale: "0.4",
            opacity: 0.9,
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0)",
          }}
        />
        <img
          src="/husse-figure.png"
          alt="Husse"
          style={{
            scale: "0.5",
            left: 0,
            opacity: 0.8,
            zIndex: 1,
            marginLeft: "-120px",
          }}
        />
      </div>
    </div>
  );
};

export default Navigation;