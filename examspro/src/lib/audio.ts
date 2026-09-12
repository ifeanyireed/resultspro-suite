class AudioPlayer {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private unlocked = false;

  // The base URL points to Cloudinary
  private baseUrl = 'https://res.cloudinary.com/qsdwzejd/video/upload/v1/examspro/sounds';

  preload(soundNames: string[]) {
    if (typeof window === 'undefined') return;
    soundNames.forEach(name => {
      if (!this.sounds.has(name)) {
        const audio = new Audio(`${this.baseUrl}/${name}`);
        audio.preload = 'auto';
        this.sounds.set(name, audio);
      }
    });
  }

  unlock() {
    if (this.unlocked || typeof window === 'undefined') return;
    this.unlocked = true;
    
    // Play and immediately pause all preloaded sounds to unlock them
    this.sounds.forEach(audio => {
      audio.muted = true;
      audio.play().then(() => {
        audio.pause();
        audio.muted = false;
        audio.currentTime = 0;
      }).catch(err => {
        console.warn('Audio unlock failed for a sound:', err);
      });
    });
  }

  public isMuted = false;

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.sounds.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    return this.isMuted;
  }

  play(soundName: string) {
    if (typeof window === 'undefined' || this.isMuted) return;
    const audio = this.sounds.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error(`Failed to play ${soundName}:`, err));
    } else {
      // Fallback
      const newAudio = new Audio(`${this.baseUrl}/${soundName}`);
      this.sounds.set(soundName, newAudio);
      newAudio.play().catch(err => console.error(`Failed to play fallback ${soundName}:`, err));
    }
  }
}

export const audioPlayer = new AudioPlayer();
