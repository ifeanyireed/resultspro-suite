const url = "https://drive.google.com/file/d/11Tx0jYXKRHbgL0KbSMrBofL91Lp3vhqN/view?usp=sharing";
const formatDriveUrl = (url) => {
  if (url.includes('drive.google.com/file/d/')) {
    return url.replace(/\/view.*/, '/preview');
  }
  return url;
}
console.log(formatDriveUrl(url));
