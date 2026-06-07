import { useCallback, useEffect, useRef, useState } from "react";

export interface ScreenShareFeed {
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  chunks: Blob[];
  blob: Blob | null;
  startedAt: Date | null;
  endedAt: Date | null;
}

declare global {
  interface Window {
    lilypadSupportFeed: ScreenShareFeed;
  }
}

const feed: ScreenShareFeed = {
  stream: null,
  recorder: null,
  chunks: [],
  blob: null,
  startedAt: null,
  endedAt: null,
};

window.lilypadSupportFeed = feed;

function getSupportedMimeType() {
  if (!window.MediaRecorder) return "";
  return (
    ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(
      (type) => MediaRecorder.isTypeSupported(type),
    ) || ""
  );
}

export function useScreenShare() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState("Screen sharing is off");
  const [error, setError] = useState<string>();

  const stop = useCallback(() => {
    if (feed.recorder?.state === "recording") {
      feed.recorder.stop();
    }
    feed.stream?.getTracks().forEach((track) => track.stop());
    feed.stream = null;
    feed.recorder = null;
    feed.endedAt = new Date();
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsSharing(false);
    setIsPending(false);
    setStatus("Screen sharing is off");
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError("Screen sharing is not available in this browser.");
      return;
    }

    setError(undefined);
    setIsPending(true);
    setStatus("Choose a screen or tab to share");

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      if (feed.stream) stop();
      feed.chunks = [];
      feed.blob = null;
      feed.endedAt = null;
      feed.stream = stream;
      feed.startedAt = new Date();

      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsPending(false);
      setIsSharing(true);
      setStatus("Lily can see your shared screen");

      if (window.MediaRecorder) {
        const mimeType = getSupportedMimeType();
        const recorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined,
        );
        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) feed.chunks.push(event.data);
        });
        recorder.addEventListener("stop", () => {
          feed.blob = new Blob(feed.chunks, {
            type: recorder.mimeType || "video/webm",
          });
          feed.endedAt = new Date();
        });
        recorder.start(1000);
        feed.recorder = recorder;
      }

      stream.getVideoTracks()[0]?.addEventListener(
        "ended",
        () => {
          stop();
          setStatus("Screen sharing stopped");
        },
        { once: true },
      );
    } catch (caught) {
      const denied =
        caught instanceof DOMException && caught.name === "NotAllowedError";
      setError(
        denied
          ? "Screen sharing was not allowed."
          : "Could not start screen sharing. Check browser permissions.",
      );
      setIsPending(false);
      setIsSharing(false);
      setStatus("Screen sharing is off");
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return {
    videoRef,
    isSharing,
    isPending,
    status,
    error,
    start,
    stop,
  };
}
