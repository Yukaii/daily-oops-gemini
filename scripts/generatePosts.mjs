import fetch from "node-fetch";
import dotenv from "dotenv";
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../posts");

process.env.HACKMD_PROFILE;
const apiUrl = `https://hackmd.io/api/@${process.env.HACKMD_PROFILE}/overview`;

async function run() {
  const { notes } = await fetch(apiUrl).then((res) => res.json());

  // save posts as markdown file
  await Promise.all(notes.map(async (post) => {
    const fullContent = await fetch(`https://hackmd.io/${post.id}/download`).then((res) => res.text());
    fs.writeFileSync(path.join(outputDir, `${post.shortId}.md`), fullContent, 'utf8');
  }));

  const indexContent = generateIndex(notes);

  fs.writeFileSync(path.join(outputDir, `index.md`), indexContent, 'utf8');
}

function generateIndex(posts) {
  const linkes = posts
    .map((post) => {
      return `- [${post.title}](./${post.shortId}.gemtext)`;
    })
    .join("\n");

  return `# DailyOops

${linkes}
`;
}

run();
