const url = "https://drive.google.com/file/d/11Tx0jYXKRHbgL0KbSMrBofL91Lp3vhqN/view?usp=sharing";
const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
if (match) {
  console.log(`https://docs.google.com/uc?export=download&id=${match[1]}`);
}
