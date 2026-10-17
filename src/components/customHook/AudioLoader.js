import { useState, useEffect, useCallback, useRef } from "react";
import apiFactory from "../../api";

export const useAudioLoader = (resourceId) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const [playbackState, setPlaybackState] = useState("stopped");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [playbackRate, setPlaybackRateState] = useState(1);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!resourceId) {
      setLoading(false);
      setError("Bad request: resourceId is missing.");
      setAudioUrl(null);
      setBlob(null);
      return;
    }

    const controller = new AbortController();
    let objectUrl = null;

    const handleProgress = (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      }
    };

    const fetchAudio = async () => {
      setLoading(true);
      setError(null);
      setAudioUrl(null);
      setBlob(null);
      setProgress(0);
      setPlaybackState("stopped");
      setCurrentTime(0);
      setDuration(0);

      try {
        const fetchedBlob = await apiFactory.resourceApi.getStreamFileAsBlob(
          resourceId,
          handleProgress,
          controller.signal
        );

        if (fetchedBlob?.type === "application/json") {
          throw new Error("Failed to fetch audio data, received JSON.");
        }

        if (fetchedBlob && fetchedBlob.size > 0) {
          setBlob(fetchedBlob);
          objectUrl = URL.createObjectURL(fetchedBlob);
          setAudioUrl(objectUrl);
        } else {
          throw new Error("Audio blob is empty or invalid after fetching.");
        }
      } catch (err) {
        if (err?.name !== "AbortError" && err?.name !== "CanceledError") {
          console.error("Failed to fetch audio:", err);
          setError(err.message || "An unknown error occurred");
        } else {
          console.log("Request was canceled.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAudio();

    return () => {
      controller.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resourceId]);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.volume = volume;
      audio.muted = isMuted;
      audio.playbackRate = playbackRate;

      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handlePlay = () => setPlaybackState("playing");
      const handlePause = () => setPlaybackState("paused");
      const handleEnded = () => {
        setPlaybackState("stopped");
        setCurrentTime(0);
      };

      const handleVolumeChange = () => {
        setIsMuted(audio.muted);
        setVolume(audio.volume);
      };

      audio.addEventListener("loadeddata", setAudioData);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("volumechange", handleVolumeChange);

      return () => {
        audio.removeEventListener("loadeddata", setAudioData);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("volumechange", handleVolumeChange);
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  const setPlaybackRate = useCallback((rate) => {
    setPlaybackRateState(rate);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const seek = useCallback(
    (time) => {
      if (audioRef.current && isFinite(time)) {
        audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
      }
    },
    [duration]
  );

  const download = useCallback(
    (filename = "willo-audio") => {
      if (!blob || error) {
        console.error(
          "Cannot download: Blob is not available or an error occurred."
        );
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = blob.type.split("/")[1] || "mp3";
      link.setAttribute("download", `${filename}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [blob, error]
  );

  const setVolumeLevel = useCallback((level) => {
    const newVolume = Math.max(0, Math.min(1, level));
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prevMuted) => !prevMuted);
  }, []);

  return {
    audioUrl,
    loading,
    error,
    progress,
    playbackState,
    duration,
    currentTime,
    play,
    pause,
    stop,
    seek,
    download,
    volume,
    isMuted,
    setVolumeLevel,
    toggleMute,
    playbackRate,
    setPlaybackRate,
  };
};
