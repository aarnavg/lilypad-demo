export function VoiceWave() {
  return (
    <div className="lily-wave" aria-label="Lily is speaking">
      {[0, 1, 2, 3, 4].map((bar) => (
        <span key={bar} style={{ animationDelay: `${bar * 90}ms` }} />
      ))}
    </div>
  );
}
