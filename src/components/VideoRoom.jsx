import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = '86d24524d7e74010a5db49032a886241';
const TOKEN = '007eJxTYJgjaXfs/t5nqq73fhcdcs4+uCz86MJ6nlDX4rBf/889uPZPgcHCLMXIxNTIJMU81dzEwNAg0TQlycTSwNgo0cLCzMjE8HNmcUZDICODj4MrMyMDBIL4zAzlKVkMDAD1liD0';
const CHANNEL = 'wdj';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export const VideoRoom = ({ onLeave }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === 'video') setUsers((prev) => [...prev, user]);
    if (mediaType === 'audio') user.audioTrack?.play();
  };

  const handleUserLeft = (user) => {
    setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
  };

  useEffect(() => {
    const init = async () => {
      client.on('user-published', handleUserJoined);
      client.on('user-left', handleUserLeft);

      const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      setLocalTracks([audioTrack, videoTrack]);
      setUsers((prev) => [...prev, { uid, audioTrack, videoTrack }]);

      videoTrack.play(`local-player-${uid}`);
      audioTrack.play();

      await client.publish([audioTrack, videoTrack]);
    };

    init();

    return () => {
      client.removeAllListeners();
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });
      client.leave();
    };
  }, []);

  const toggleCamera = () => {
    if (localTracks[1]) {
      localTracks[1].setEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (localTracks[0]) {
      localTracks[0].setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const toggleSpeaker = () => {
    users.forEach((user) => {
      if (user.audioTrack) {
        user.audioTrack.setEnabled(!isSpeakerOn);
      }
    });
    setIsSpeakerOn(!isSpeakerOn);
  };

  const leaveCall = () => {
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });
    client.leave();
    onLeave();
  };

  return (
    <div style={styles.container}>
      {/* 🔼 Controls on top */}
      <div style={styles.controls}>
        <button style={styles.button} onClick={toggleCamera}>
          {isCameraOn ? '📷 Camera Off' : '📷 Camera On'}
        </button>
        <button style={styles.button} onClick={toggleMic}>
          {isMicOn ? '🎤 Mic Off' : '🎤 Mic On'}
        </button>
        <button style={styles.button} onClick={toggleSpeaker}>
          {isSpeakerOn ? '🔇 Speaker Off' : '🔊 Speaker On'}
        </button>
        <button style={{ ...styles.button, backgroundColor: '#e53935' }} onClick={leaveCall}>
          ❌ End Call
        </button>
      </div>

      {/* 🔽 Video grid below */}
      <div style={styles.videoGrid}>
        {users.map((user) => (
          <div key={user.uid} style={styles.videoBox}>
            <VideoPlayer user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

// 💅 Styling (updated layout)
const styles = {
  container: {
    background: '#1a1a2e',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    color: '#fff',
    fontFamily: 'Segoe UI, sans-serif',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    padding: '10px 20px',
    background: '#0f3460',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  button: {
    backgroundColor: '#4fc3f7',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '20px',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    justifyItems: 'center',
    paddingBottom: '40px',
  },
  videoBox: {
  backgroundColor: '#1f1f1f', // consistent with overall theme
  borderRadius: '12px',
  overflow: 'hidden',
  border: '2px solid #00adb5',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
  width: '100%',
  aspectRatio: '16/9', // maintain consistent shape
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
};
