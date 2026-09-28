const url = "https://res.cloudinary.com/qsdwzejd/raw/upload/v1790326181/uploads/html/slj2vxtbok5yvwwrzsl5";
(async () => {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      console.log('Upstream error', res.status);
      return;
    }
    let html = await res.text();
    console.log("Success! HTML length:", html.length);
  } catch (err) {
    console.error('HTML proxy error:', err);
  }
})();
