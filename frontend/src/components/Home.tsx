import "../App.css";

const Home = () => {
  return (
    <div
      className="image-container"
      style={{
        marginTop: "20px",
        width: "700px",
        border: "1px solid #ccc",
        borderRadius: "40px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        // Position relative is essential for absolute children
        position: "relative",
        // Set a fixed height for the container to have a reference for positioning
        height: "700px", // Adjust as needed
      }}
    >
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
