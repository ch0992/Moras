const fs = require("node:fs");
const path = require("node:path");

async function run() {
  const sqlPath = path.join(__dirname, "../supabase/migrations/20260520000000_create_matching_tables.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("Applying migration from:", sqlPath);

  const res = await fetch("https://api.supabase.com/v1/projects/xzlwcfmdbjxhiycywtmi/query", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (res.ok) {
    console.log("Migration applied successfully!");
    const data = await res.json();
    console.log(data);
  } else {
    console.error("Migration failed:", await res.text());
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
