import { useState } from 'react';
import './App.css';
import { VideoRoom } from './components/VideoRoom';
import logo from './assets/logo.png';

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div style={styles.page}>
      {!joined ? (
        <div style={styles.card}>
          <img src={logo} alt="HAL Logo" style={styles.logo} />

          <h1 style={styles.title}>HAL KORWA WEB VIRTUAL APP</h1>

          <button style={styles.button} onClick={() => setJoined(true)}>
            Join Room
          </button>
        </div>
      ) : (
        <VideoRoom onLeave={() => setJoined(false)} />

      )}
    </div>
  );
}

// 💡 Inline styles for simplicity (can move to CSS later)
const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
  },
  logo: {
    width: '100px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '22px',
    marginBottom: '30px',
    color: '#333333',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

// Hover effect (can be added in App.css if needed)

export default App;
