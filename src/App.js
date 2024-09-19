import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './App.css';

// Register Chart.js components
Chart.register(...registerables);

function App() {
  const [playerNames, setPlayerNames] = useState({ playerOne: '', playerTwo: '' });
  const [scores, setScores] = useState([]);
  const [round, setRound] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScores, setCurrentScores] = useState({ p1: '', p2: '' });

  const rounds = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];

  const handleStartGame = () => {
    setGameStarted(true);
    setModalVisible(true);
  };

  const handleModalSubmit = () => {
    if (currentScores.p1 === '' || currentScores.p2 === '') {
      alert('Enter scores for both players');
      return;
    }

    const newScores = [...scores];
    newScores.push({ round: rounds[round], p1: parseInt(currentScores.p1), p2: parseInt(currentScores.p2) });
    setScores(newScores);
    setRound(round + 1);
    setCurrentScores({ p1: '', p2: '' });

    if (round + 1 >= rounds.length) {
      setModalVisible(false);
      setGameStarted(false);
    } else {
      setModalVisible(false);
    }
  };

  // Calculate cumulative scores
  const cumulativeScores = scores.reduce(
    (acc, score) => {
      const newP1 = acc.p1 + score.p1;
      const newP2 = acc.p2 + score.p2;
      acc.p1 = newP1;
      acc.p2 = newP2;
      return {
        p1: acc.p1,
        p2: acc.p2,
        labels: [...acc.labels, rounds[acc.index]],
        p1Data: [...acc.p1Data, acc.p1],
        p2Data: [...acc.p2Data, acc.p2],
        index: acc.index + 1
      };
    },
    { p1: 0, p2: 0, labels: [], p1Data: [], p2Data: [], index: 0 }
  );

  const graphData = {
    labels: cumulativeScores.labels,
    datasets: [
      {
        label: playerNames.playerOne,
        data: cumulativeScores.p1Data,
        borderColor: 'rgba(173, 216, 230, 1)', // Light blue
        backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light blue
        fill: true,
      },
      {
        label: playerNames.playerTwo,
        data: cumulativeScores.p2Data,
        borderColor: 'rgba(255, 182, 193, 1)', // Light pink
        backgroundColor: 'rgba(255, 182, 193, 0.2)', // Light pink
        fill: true,
      },
    ],
  };

  return (
    <div className="App">
      {!gameStarted && (
        <div className="modal">
          <h2>Start a New Game</h2>
          <input
            type="text"
            placeholder="Player One Name"
            value={playerNames.playerOne}
            onChange={(e) => setPlayerNames({ ...playerNames, playerOne: e.target.value })}
          />
          <input
            type="text"
            placeholder="Player Two Name"
            value={playerNames.playerTwo}
            onChange={(e) => setPlayerNames({ ...playerNames, playerTwo: e.target.value })}
          />
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}

      {gameStarted && (
        <div>
          <h1>Jin Rummy Scoreboard</h1>
          {gameStarted && round < rounds.length && !modalVisible && (
            <button className="enter-score-button" onClick={() => setModalVisible(true)}>Enter Round {round + 1} Score</button>
          )}
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>{playerNames.playerOne}</th>
                <th>{playerNames.playerTwo}</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((roundLabel, index) => (
                <tr key={index}>
                  <td>{roundLabel}</td>
                  <td>{scores.find(score => score.round === roundLabel)?.p1 || '-'}</td>
                  <td>{scores.find(score => score.round === roundLabel)?.p2 || '-'}</td>
                </tr>
              ))}
              <tr>
                <td>Total</td>
                <td>{scores.reduce((total, score) => total + score.p1, 0)}</td>
                <td>{scores.reduce((total, score) => total + score.p2, 0)}</td>
              </tr>
            </tbody>
          </table>
          <h2>Score Progression</h2>
          <div className="graph-container">
            <Line data={graphData} />
          </div>
          {modalVisible && (
            <div className="modal">
              <h2>{`Enter scores for Round ${round + 1}`}</h2>
              <input
                type="number"
                placeholder={`Score for ${playerNames.playerOne}`}
                value={currentScores.p1}
                onChange={(e) => setCurrentScores({ ...currentScores, p1: e.target.value })}
              />
              <input
                type="number"
                placeholder={`Score for ${playerNames.playerTwo}`}
                value={currentScores.p2}
                onChange={(e) => setCurrentScores({ ...currentScores, p2: e.target.value })}
              />
              <button onClick={handleModalSubmit}>Submit Score</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
