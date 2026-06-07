import { useEffect, useRef, useState } from "react";

type StatusVariant = "default" | "error";

type ScreenShareFeed = {
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  chunks: Blob[];
  blob: Blob | null;
  startedAt: Date | null;
  endedAt: Date | null;
};

declare global {
  interface Window {
    lilypadSupportFeed: ScreenShareFeed;
  }
}

const screenShareFeed: ScreenShareFeed = {
  stream: null,
  recorder: null,
  chunks: [],
  blob: null,
  startedAt: null,
  endedAt: null,
};

window.lilypadSupportFeed = screenShareFeed;

function getSupportedMimeType() {
  const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function App() {
  const widgetRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSharePending, setIsSharePending] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [status, setStatus] = useState("Waiting for permission.");
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("default");

  function updateStatus(message: string, variant: StatusVariant = "default") {
    setStatus(message);
    setStatusVariant(variant);
  }

  function resetRecording() {
    screenShareFeed.chunks = [];
    screenShareFeed.blob = null;
    screenShareFeed.endedAt = null;
  }

  function clearFeed() {
    if (screenShareFeed.recorder?.state === "recording") {
      screenShareFeed.recorder.stop();
    }

    if (screenShareFeed.stream) {
      screenShareFeed.stream.getTracks().forEach((track) => track.stop());
    }

    screenShareFeed.stream = null;
    screenShareFeed.recorder = null;
    screenShareFeed.endedAt = new Date();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsSharing(false);
    setIsSharePending(false);
  }

  async function startScreenShare() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      updateStatus("Screen sharing is not available in this browser.", "error");
      return;
    }

    updateStatus("Opening your browser's screen picker...");
    setIsSharePending(true);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      clearFeed();
      resetRecording();

      screenShareFeed.stream = stream;
      screenShareFeed.startedAt = new Date();

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsSharePending(false);
      setIsSharing(true);

      if (window.MediaRecorder) {
        const mimeType = getSupportedMimeType();
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            screenShareFeed.chunks.push(event.data);
          }
        });

        recorder.addEventListener("stop", () => {
          screenShareFeed.blob = new Blob(screenShareFeed.chunks, {
            type: recorder.mimeType || "video/webm",
          });
          screenShareFeed.endedAt = new Date();
        });

        recorder.start(1000);
        screenShareFeed.recorder = recorder;
        updateStatus("Screen feed is active and recording in window.lilypadSupportFeed.");
      } else {
        updateStatus("Screen feed is active in window.lilypadSupportFeed. Recording is not supported here.");
      }

      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        clearFeed();
        updateStatus("Screen sharing stopped.");
      });
    } catch (error) {
      const denied = error instanceof DOMException && error.name === "NotAllowedError";
      setIsSharePending(false);
      setIsSharing(false);
      updateStatus(
        denied
          ? "Screen sharing was not allowed. Try again when you're ready."
          : "Could not start screen sharing. Check browser permissions and try again.",
        "error",
      );
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isPanelOpen) {
        setIsPanelOpen(false);
      }
    }

    function onClick(event: MouseEvent) {
      if (
        isPanelOpen &&
        event.target instanceof Node &&
        !widgetRef.current?.contains(event.target)
      ) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    };
  }, [isPanelOpen]);

  useEffect(() => clearFeed, []);

  return (
    <>
      <main className="page-shell">
        <section className="workspace">
          <div className="eyebrow">Lilypad Console</div>
          <h1>Support is one click away.</h1>
          <p>
            This page includes a floating support control in the lower-right
            corner. Open it to request browser screen sharing and keep the active
            screen feed available in the widget.
          </p>
          <div className="demo-surface" aria-hidden="true">
            <div className="demo-window">
              <div className="demo-window__bar">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="demo-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <aside className="support-widget" data-support-widget ref={widgetRef}>
        <button
          className="support-launcher"
          type="button"
          aria-label="Open support screen sharing"
          aria-expanded={isPanelOpen}
          data-support-toggle
          onClick={() => setIsPanelOpen((current) => !current)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 6.8A2.8 2.8 0 0 1 6.8 4h10.4A2.8 2.8 0 0 1 20 6.8v5.4a2.8 2.8 0 0 1-2.8 2.8H9l-4.2 3.4a.9.9 0 0 1-1.45-.7V6.8Z" />
            <path d="M8 8.7h8M8 11.3h5.6" />
          </svg>
        </button>

        <section
          className="support-panel"
          aria-label="Support screen sharing"
          hidden={!isPanelOpen}
          data-support-panel
        >
          <div className="support-panel__header">
            <div>
              <p className="support-kicker">Live support</p>
              <h2>Share your screen</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="Close support panel"
              data-support-close
              onClick={() => setIsPanelOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <p className="support-copy">
            Start a temporary browser screen share so support can see what you see.
          </p>

          <div
            className={`share-preview${isSharing ? " has-feed" : ""}`}
            data-share-preview
          >
            <video autoPlay muted playsInline data-share-video ref={videoRef}></video>
            <div className="share-preview__empty" data-empty-state>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="3.5" y="4.5" width="17" height="11.5" rx="2" />
                <path d="M8.5 20h7M12 16v4" />
              </svg>
              <span>No screen feed yet</span>
            </div>
          </div>

          <div
            className={`support-status${statusVariant === "error" ? " is-error" : ""}`}
            data-support-status
          >
            {status}
          </div>

          <div className="support-actions">
            <button
              className="primary-action"
              type="button"
              data-share-start
              disabled={isSharing || isSharePending}
              onClick={startScreenShare}
            >
              Share screen
            </button>
            <button
              className="secondary-action"
              type="button"
              disabled={!isSharing}
              data-share-stop
              onClick={() => {
                clearFeed();
                updateStatus("Screen sharing stopped.");
              }}
            >
              Stop
            </button>
          </div>
        </section>
      </aside>
    </>
  );
}

export default App;
