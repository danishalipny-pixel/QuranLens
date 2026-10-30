import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  X,
  Radio,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export default function AudioPlayerBar() {
  const {
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
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    changeReciter,
    toggleRepeat,
    closePlayer,
    playAyah,
  } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeekChange = (e) => {
    seek(Number(e.target.value));
  };

  const handleNext = () => {
    playAyah(currentTrack.surahNumber, currentTrack.ayahNumber + 1, currentTrack.surahName);
  };

  const handlePrev = () => {
    if (currentTrack.ayahNumber > 1) {
      playAyah(currentTrack.surahNumber, currentTrack.ayahNumber - 1, currentTrack.surahName);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-900/95 text-white backdrop-blur-lg border-t border-charcoal-800 shadow-2xl transition-all duration-300">
      
      {/* Top progress line */}
      <div className="relative w-full h-1 bg-charcoal-800 group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-gold-400 relative transition-all"
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Track Metadata */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0 justify-between sm:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-soft">
              {currentTrack.surahNumber}:{currentTrack.ayahNumber}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold truncate text-white">
                {currentTrack.surahName || `Surah ${currentTrack.surahNumber}`}
              </h4>
              <p className="text-xs text-charcoal-400 truncate flex items-center gap-1.5">
                <span>Ayah {currentTrack.ayahNumber}</span>
                <span>•</span>
                <span className="text-emerald-400">
                  {RECITERS.find((r) => r.id === reciter)?.name.split(' ')[0]}
                </span>
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={closePlayer}
            className="sm:hidden text-charcoal-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Playback Controls */}
        <div className="flex flex-col items-center gap-1 w-full sm:w-1/3">
          <div className="flex items-center gap-4">
            
            {/* Previous Ayah */}
            <button
              onClick={handlePrev}
              disabled={currentTrack.ayahNumber <= 1}
              className="text-charcoal-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous Ayah"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-soft hover:scale-105 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Ayah */}
            <button
              onClick={handleNext}
              className="text-charcoal-300 hover:text-white transition"
              title="Next Ayah"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Repeat Mode */}
            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded transition ${
                repeatMode === 'ayah'
                  ? 'text-gold-400 bg-gold-950/50'
                  : 'text-charcoal-400 hover:text-white'
              }`}
              title={repeatMode === 'ayah' ? 'Repeat this Ayah (On)' : 'Repeat Off'}
            >
              <Repeat className="w-4 h-4" />
            </button>

          </div>

          {/* Time display */}
          <div className="flex items-center gap-2 text-[11px] text-charcoal-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Controls: Reciter selector & Volume */}
        <div className="hidden sm:flex items-center justify-end gap-4 w-1/3">
          
          {/* Reciter Selector */}
          <div className="relative">
            <select
              value={reciter}
              onChange={(e) => changeReciter(e.target.value)}
              className="bg-charcoal-800 text-xs text-charcoal-200 py-1.5 px-2.5 rounded-lg border border-charcoal-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-charcoal-400 hover:text-white">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="w-16 h-1 bg-charcoal-700 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Close Player */}
          <button
            onClick={closePlayer}
            className="text-charcoal-400 hover:text-white p-1 rounded-lg hover:bg-charcoal-800 transition"
            title="Close Audio Player"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
