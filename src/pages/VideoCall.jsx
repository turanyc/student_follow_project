import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video as VideoIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAuth } from '../context/AuthContext';

const VideoCall = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [inCall, setInCall] = useState(false);
  const [roomName, setRoomName] = useState('');

  // Sadece projenin prototipi için sabit bir oda mantığı. 
  // İdeal senaryoda Koç ve Öğrenci ID'sine göre oluşturulabilir.
  useEffect(() => {
    if (currentUser) {
      if (userRole === 'coach') {
        setRoomName(`OgrenciTakip-Koc-${currentUser.uid}`);
      } else {
        // Öğrenci ise, girmek istediği odayı bilmeli.
        // Şimdilik demo olduğu için koçun ID'siyle oluşan odalara katılması sağlanabilir.
        // Basitlik adına sabit bir oda ismi koyuyoruz:
        setRoomName(`OgrenciTakip-Genel-Oda-123456`);
      }
    }
  }, [currentUser, userRole]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h2>Canlı Görüşme Odası</h2>
      </div>

      <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden', padding: 0 }}>
        
        {!inCall ? (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ 
              width: '100px', height: '100px', backgroundColor: 'var(--primary-color)', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' 
            }}>
              <VideoIcon size={48} color="white" />
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Görüşmeye Hazır mısınız?</h2>
            <button className="btn btn-success" onClick={() => setInCall(true)} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
              Görüşmeye Katıl
            </button>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                    displayName: currentUser?.email?.split('@')[0] || 'Kullanıcı'
                }}
                onApiReady={(externalApi) => {
                    // API events
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
