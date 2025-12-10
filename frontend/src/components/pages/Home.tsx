import "../../styles/App.css";

const Home = () => {
  return (
    <div className="image-container">
      <img
        className="img"
        src="/background.png"
        alt="Hertha running"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px", // Add rounded corners to the image
          zIndex: 0,
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          // Center the content on the image
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", // Center content within this div
          // Add some styling for the text overlay
          backgroundColor: "rgba(87, 91, 58, 0.71)",
          padding: "20px",
          borderRadius: "20px",
          zIndex: 1,
        }}
      >
        <img
          src="/hertha.png"
          alt="Hertha the dog"
          style={{
            width: "220px",
            height: "250px",
            borderRadius: "50%",
            zIndex: 1,
            border: "5px solid #40483bed",
            objectFit: "cover",
            opacity: 0.8,
          }}
        />
        <a href="/jaktdagbok">
          <button>
            <h1>Herthas jaktdagbok</h1>
          </button>
        </a>
      </div>
    </div>
  );
};

export default Home;
