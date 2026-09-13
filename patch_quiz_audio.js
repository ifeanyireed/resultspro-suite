const fs = require('fs');

let content = fs.readFileSync('examspro/src/app/quiz/page.tsx', 'utf8');

// Insert audio logic at the top of QuizContent
const insertion1 = `  const [isMuted, setIsMuted] = useState(audioPlayer.isMuted);

  const handleToggleMute = () => {
    setIsMuted(audioPlayer.toggleMute());
  };

  useEffect(() => {
    audioPlayer.preload(['correct_answer.mp3', 'wrong_answer.mp3']);
  }, []);
`;
content = content.replace('function QuizContent() {\n  const searchParams', 'function QuizContent() {\n' + insertion1 + '\n  const searchParams');

// Play sounds inside handleVerify
content = content.replace(
  'toast.success(`Correct! +${data.coinsEarned} Coins`);',
  'audioPlayer.play(\'correct_answer.mp3\');\n          toast.success(`Correct! +${data.coinsEarned} Coins`);'
);
content = content.replace(
  'toast.error(`Incorrect!`);',
  'audioPlayer.play(\'wrong_answer.mp3\');\n          toast.error(`Incorrect!`);'
);

// Unlock audio on handleSelect
content = content.replace(
  'const handleSelect = (optionId: string) => {',
  'const handleSelect = (optionId: string) => {\n    audioPlayer.unlock();'
);

fs.writeFileSync('examspro/src/app/quiz/page.tsx', content);
console.log("Audio injected");
