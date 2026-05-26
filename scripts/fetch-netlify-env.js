const TOKEN = 'nfc_FGAhRHLQYi9Zz9AeNFC7HmyXfMkDNgLhdb80';
const SITE_ID = '14188e52-ac8f-469c-ad8a-ad398eb5fb15';

async function run() {
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/env`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    if (!res.ok) {
      console.error('Fetch failed:', res.status, await res.text());
      return;
    }
    const envs = await res.json();
    console.log(JSON.stringify(envs, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
