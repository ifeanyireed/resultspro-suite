const urls = [
  "https://docs.google.com/presentation/d/1mPBbPd6cQgcQuYvWvhhamiOEZ_e7ko5vBoJz9MYNJmc/edit?usp=sharing",
  "https://docs.google.com/document/d/1234/edit",
  "https://example.com/test.pptx"
];

const formatEmbedUrl = (url, type) => {
  if (!url) return '';
  if (url.includes('docs.google.com')) {
    return url.replace(/\/(edit|view).*/, '/embed?rm=minimal');
  }
  if (type === 'PPT') {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  return url;
};

urls.forEach(u => console.log(formatEmbedUrl(u, 'PPT')));
