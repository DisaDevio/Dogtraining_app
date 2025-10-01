import React, { useState, useEffect } from "react";
import "./LearningCurve.css";

interface LearningCurveItem {
  id: number;
  text: string;
  when: string;
  inProgress: boolean;
  completed: boolean;
}

interface SavedLearningCurveItem {
  id: number;
  inProgress: boolean;
  completed: boolean;
}

const LearningCurve: React.FC = () => {
  const initialItems: LearningCurveItem[] = [
    // {
    //   id: 1,
    //   text: "Social träning",
    //   when: "2",
    //   inProgress: false,
    //   completed: false,
    // },
    // {
    //   id: 2,
    //   text: "Nej/ja kommando",
    //   when: "2.5",
    //   inProgress: false,
    //   completed: false,
    // },
    // {
    //   id: 3,
    //   text: "Koppelvana",
    //   when: "2.5",
    //   inProgress: false,
    //   completed: false,
    // },
    // {
    //   id: 4,
    //   text: "Kravlös Inkallning",
    //   when: "2.5",
    //   inProgress: false,
    //   completed: false,
    // },
    // {
    //   id: 5,
    //   text: "Kravlöst stannakommando",
    //   when: "2.5",
    //   inProgress: false,
    //   completed: false,
    // },
    {
      id: 6,
      text: "Avancekommando",
      when: "3",
      inProgress: false,
      completed: false,
    },
    {
      id: 7,
      text: "Spontanapportering",
      when: "3",
      inProgress: false,
      completed: false,
    },
    {
      id: 8,
      text: "Ovillkorlig inkallning",
      when: "3.5",
      inProgress: false,
      completed: false,
    },
    {
      id: 9,
      text: "Stanna kvar",
      when: "3.5",
      inProgress: false,
      completed: false,
    },
    {
      id: 10,
      text: "Självständigt sök",
      when: "4",
      inProgress: false,
      completed: false,
    },
    {
      id: 11,
      text: "Passivitet vid dummykast",
      when: "4",
      inProgress: false,
      completed: false,
    },
    {
      id: 12,
      text: "Utkommando",
      when: "4.5",
      inProgress: false,
      completed: false,
    },
    {
      id: 13,
      text: "Oftivilligt stannakommando",
      when: "5",
      inProgress: false,
      completed: false,
    },
    {
      id: 14,
      text: "Stanna kvar inom rimliga avstånd",
      when: "5",
      inProgress: false,
      completed: false,
    },
    {
      id: 15,
      text: "Fritt följ vid sidan",
      when: "5",
      inProgress: false,
      completed: false,
    },
    {
      id: 16,
      text: "Dirigering",
      when: "6",
      inProgress: false,
      completed: false,
    },
    {
      id: 17,
      text: "Släpspår",
      when: "7",
      inProgress: false,
      completed: false,
    },
    {
      id: 18,
      text: "Vattenträning",
      when: "7",
      inProgress: false,
      completed: false,
    },
    {
      id: 19,
      text: "Fågelsituationer",
      when: "7",
      inProgress: false,
      completed: false,
    },
    {
      id: 20,
      text: "Första fågeln",
      when: "",
      inProgress: false,
      completed: false,
    },
  ];

  const [items, setItems] = useState<LearningCurveItem[]>(initialItems);

  const API_URL = "http://localhost:8000"; // Backend URL

  // Load saved states on component mount
  useEffect(() => {
    const loadLearningCurve = async () => {
      try {
        const response = await fetch(`${API_URL}/load-learning-curve`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const savedItems: SavedLearningCurveItem[] = await response.json();

        setItems((prevItems) =>
          prevItems.map((item) => {
            const savedItem = savedItems.find((sItem) => sItem.id === item.id);
            return savedItem
              ? {
                  ...item,
                  inProgress: savedItem.inProgress,
                  completed: savedItem.completed,
                }
              : item;
          })
        );
      } catch (error) {
        console.error("Failed to load learning curve data:", error);
      }
    };

    loadLearningCurve();
  }, []); // Empty dependency array means this runs once on mount

  // Save states whenever 'items' changes
  useEffect(() => {
    const saveLearningCurve = async () => {
      try {
        const itemsToSave: SavedLearningCurveItem[] = items.map(
          ({ id, inProgress, completed }) => ({ id, inProgress, completed })
        );

        const response = await fetch(`${API_URL}/save-learning-curve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemsToSave),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Learning curve data saved successfully.");
      } catch (error) {
        console.error("Failed to save learning curve data:", error);
      }
    };

    // Only save if items have been initialized (i.e., not the initial empty state)
    // and if there are actual items to save.
    if (items.length > 0) {
      saveLearningCurve();
    }
  }, [items]); // Rerun when 'items' state changes

  const handleCheckboxChange = (
    id: number,
    type: "inProgress" | "completed"
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [type]: !item[type],
              // Ensure only one checkbox can be true at a time for a given item
              ...(type === "inProgress" && item.completed
                ? { completed: false }
                : {}),
              ...(type === "completed" && item.inProgress
                ? { inProgress: false }
                : {}),
            }
          : item
      )
    );
  };

  return (
    <div className="learning-curve-container" style={{ position: "relative" }}>
      <img
        src="/hertha-husse-2.jpg"
        alt="Background"
        className="background-image"
        style={{
          objectFit: "cover",
          width: "100%",
          minHeight: "630px",
          height: "100%",
          borderRadius: "10px",
          zIndex: -1,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", // Center content within this div
        }}
      >
        <h2>Herthas träning</h2>
        <ul>
          <li>
            <span>Moment</span>

            <label>Träning</label>
            <label>Avslutad</label>
          </li>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.text}</span>

              <label>
                <input
                  type="checkbox"
                  checked={item.inProgress}
                  onChange={() => handleCheckboxChange(item.id, "inProgress")}
                />
                <span></span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleCheckboxChange(item.id, "completed")}
                />
                <span></span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LearningCurve;
