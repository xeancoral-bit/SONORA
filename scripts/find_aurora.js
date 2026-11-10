(async () => {
  const query = 'AURORA Runaway official audio';
  const res = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const regex = /"videoId":"([A-Za-z0-9_-]{11})"/g;
  const ids = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }
  console.log('Video IDs:', ids.slice(0, 6));
  for (const id of ids.slice(0, 6)) {
    try {
      const o = await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + id + '&format=json');
      const d = await o.json();
      console.log(id, '=>', d.title, '| Author:', d.author_name);
    } catch (e) {
      console.log(id, '=> error', e.message);
    }
  }
})();
