import { useState } from 'react';
import { formatNumbertToTime } from 'utils/string';

const usePlayer = (video: React.RefObject<HTMLVideoElement>) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // rewind the current time
  const rewind = () => {
    if (video.current) {
      video.current.currentTime = video.current.currentTime - (video.current.duration / 100) * 5;
    }
  };

  // forward the current time
  const forward = () => {
    if (video.current) {
      video.current.currentTime = video.current.currentTime + (video.current.duration / 100) * 5;
    }
  };

  const play = () => {
    const isPaused = video.current?.paused;
    if (isPaused) {
      video.current?.play();
    }
  };

  const pause = () => {
    const isPlaying = !video.current?.paused;
    if (isPlaying) {
      video.current?.pause();
    }
  };

  const onTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setCurrentTime(event.currentTarget.currentTime);
  };

  const onCanPlay = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setDuration(event.currentTarget.duration);
  };

  return {
    rewind,
    forward,
    play,
    pause,
    currentTime: formatNumbertToTime(currentTime) || '00:00',
    duration: formatNumbertToTime(duration) || '00:00',
    onTimeUpdate,
    onCanPlay,
  };
};

export default usePlayer;
