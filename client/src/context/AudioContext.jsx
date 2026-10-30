import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', sub: 'Classic Clear Recitation' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)', sub: 'Revered Egyptian Reciter' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary', sub: 'Strict Tajweed Accuracy' },
  { id: 'Abu_Bakr_Ash-Shatri_128kbps', name: 'Abu Bakr Al-Shatri', sub: 'Emotional & Melodic' },
];

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null); // { surahNumber, ayahNumber, surahName }
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'ayah'
  const [isLoading, setIsLoading] = useState(false);

  // Build audio URL for given surah and ayah
  const getAudioUrl = (surahNum, ayahNum, reciterId = reciter) => {
    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNum).padStart(3, '0');
    return `https://everyayah.com/data/${reciterId}/${s}${a}.mp3`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleEnded = () => {
      if (repeatMode === 'ayah') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);

  const playAyah = (surahNumber, ayahNumber, surahName = '') => {
    const audio = audioRef.current;
    const url = getAudioUrl(surahNumber, ayahNumber, reciter);

    if (
      currentTrack?.surahNumber === surahNumber &&
      currentTrack?.ayahNumber === ayahNumber
    ) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
      return;
    }

    setIsLoading(true);
    setCurrentTrack({ surahNumber, ayahNumber, surahName });
    audio.src = url;
    audio.play().catch((err) => {
      console.warn('Audio playback error:', err);
      setIsLoading(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (newVolume) => {
    const audio = audioRef.current;
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const changeReciter = (reciterId) => {
    setReciter(reciterId);
    if (currentTrack) {
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      const url = getAudioUrl(currentTrack.surahNumber, currentTrack.ayahNumber, reciterId);
      audio.src = url;
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev === 'none' ? 'ayah' : 'none'));
  };

  const closePlayer = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isLoading,
        currentTrack,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        reciter,
        RECITERS,
        playAyah,
        togglePlay,
        seek,
        changeVolume,
        toggleMute,
        changeReciter,
        toggleRepeat,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
