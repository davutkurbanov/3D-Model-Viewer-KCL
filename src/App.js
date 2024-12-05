import React, { useState } from "react";
import "./App.css";
import ModelViewer from "./ModelViewer"; // Assuming you have a ModelViewer component

const objectsData = [
  {
    id: 1,
    name: "David",
    stlUrl: "/objects/david.stl",
    description:
      "David is a masterpiece of Renaissance sculpture created in marble by Michelangelo between 1501 and 1504. It represents the Biblical hero David, a favored subject in the art of Florence.",
    links: ["https://en.wikipedia.org/wiki/David_(Michelangelo)"],
    country: "Italy",
  },
  {
    id: 2,
    name: "Coquero",
    stlUrl: "/objects/coquero.stl",
    description:
      "The Coquero statue reflects the Colombian tradition of chewing coca leaves, a practice that dates back centuries. It symbolizes the cultural and spiritual connection of indigenous communities.",
    links: ["https://en.wikipedia.org/wiki/Colombian_art"],
    country: "Colombia",
  },
  {
    id: 3,
    name: "King Ramesses VI",
    stlUrl: "/objects/ramesses.stl",
    description:
      "This statue depicts Pharaoh Ramesses VI, who ruled during the 20th Dynasty of Egypt. Known for his contributions to Theban temples, his reign is often remembered for its intricate art and architecture.",
    links: ["https://en.wikipedia.org/wiki/Ramesses_VI"],
    country: "Egypt",
  },
];

const App = () => {
  const [mode, setMode] = useState("home"); // 'home', 'explore', or 'play'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBuyPopupVisible, setBuyPopupVisible] = useState(false);

  // State for play mode
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [userGuess, setUserGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const currentObject = objectsData[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % objectsData.length);
    resetPlayState();
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? objectsData.length - 1 : prevIndex - 1
    );
    resetPlayState();
  };

  const handleObjectClick = (id) => {
    const index = objectsData.findIndex((object) => object.id === id);
    if (index !== -1) setCurrentIndex(index);
    resetPlayState();
  };

  const resetPlayState = () => {
    setGuessesLeft(3);
    setUserGuess("");
    setFeedback("");
    setShowDescription(false);
  };

  const handleGuess = () => {
    if (userGuess.toLowerCase() === currentObject.country.toLowerCase()) {
      setFeedback("Correct!");
      setShowDescription(true);
    } else {
      setGuessesLeft((prev) => prev - 1);
      setFeedback("Wrong guess. Try again.");
      if (guessesLeft - 1 <= 0) {
        setFeedback(`Out of guesses! The country is ${currentObject.country}.`);
        setShowDescription(true);
      }
    }
    setUserGuess("");
  };

  const renderHomePage = () => (
    <div className="home">
      <h1>The British Museum</h1>
      <button onClick={() => setMode("explore")} className="home-button">
        Explore
      </button>
      <button onClick={() => setMode("play")} className="home-button">
        Play
      </button>
    </div>
  );

  const renderPlayPage = () => (
    <div className="app">
      <h1 className="main-title">Guess the Country!</h1>
      <button onClick={() => setMode("home")} className="home-button">
        Home
      </button>
      <h2 className="object-title">{currentObject.name}</h2>
      <div className="gallery">
        <button onClick={handlePrevious} className="gallery-button left">
          ←
        </button>
        <div className="model-viewer-frame">
          <div className="model-viewer">
            <ModelViewer url={currentObject.stlUrl} />
          </div>
        </div>
        <button onClick={handleNext} className="gallery-button right">
          →
        </button>
      </div>
      {!showDescription ? (
        <div className="play-section">
          <p>Guesses left: {guessesLeft}</p>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter country name"
          />
          <button onClick={handleGuess}>Submit Guess</button>
          <p className="feedback">{feedback}</p>
        </div>
      ) : (
        <div className="description">
          <p>
            {feedback} The country of origin is <strong>{currentObject.country}</strong>.
          </p>
          <p>{currentObject.description}</p>
        </div>
      )}
    </div>
  );

  const renderExplorePage = () => (
    <div className="app">
      <h1 className="main-title">The British Museum</h1>
      <button onClick={() => setMode("home")} className="home-button">
        Home
      </button>
      <h2 className="object-title">{currentObject.name}</h2>
      <div className="gallery">
        <button onClick={handlePrevious} className="gallery-button left">
          ←
        </button>
        <div className="model-viewer-frame">
          <div className="model-viewer">
            <ModelViewer url={currentObject.stlUrl} />
          </div>
        </div>
        <button onClick={handleNext} className="gallery-button right">
          →
        </button>
      </div>
      <div className="description">
        <p>{currentObject.description}</p>
        <div className="links">
          {currentObject.links.map((link, index) => (
            <a key={index} href={link} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          ))}
        </div>
      </div>
      <div className="actions">
        <button className="like-button">Like</button>
        <button className="buy-button" onClick={() => setBuyPopupVisible(true)}>
          Buy
        </button>
      </div>
      <div className="related-objects">
        <h3>Related Objects</h3>
        <ul>
          {objectsData
            .filter((object) => object.id !== currentObject.id)
            .map((object) => (
              <li
                key={object.id}
                onClick={() => handleObjectClick(object.id)}
                className="related-object"
              >
                {object.name}
              </li>
            ))}
        </ul>
      </div>
      {isBuyPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <button
              className="popup-close-button"
              onClick={() => setBuyPopupVisible(false)}
            >
              ×
            </button>
            <h2>Buy {currentObject.name}</h2>
            <p>Select the size of the object:</p>
            <ul>
              <li>Small (10 cm)</li>
              <li>Medium (20 cm)</li>
              <li>Large (30 cm)</li>
            </ul>
            <p>
              You can get a 3D-printed version of this object from our gift shop
              or have it delivered to your home.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {mode === "home" && renderHomePage()}
      {mode === "explore" && renderExplorePage()}
      {mode === "play" && renderPlayPage()}
    </div>
  );
};

export default App;
