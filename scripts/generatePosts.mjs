import fetch from "node-fetch"
import dotenv from "dotenv"
import path from 'path'
import fs from 'fs'
import matter from "gray-matter"
import { URL } from 'node:url'

dotenv.config();

const __dirname = new URL('.', import.meta.url).pathname;
console.log(__dirname)
const postsDir = path.join(__dirname, "../posts");
const outputDir = path.join(__dirname, "../output");

process.env.HACKMD_PROFILE;
const apiUrl = `https://hackmd.io/api/@${process.env.HACKMD_PROFILE}/overview`;

async function run() {
  const { notes } = await fetch(apiUrl).then((res) => res.json());

  // save posts as markdown file
  const posts = await Promise.all(notes.map(async (post) => {
    const fullContent = await fetch(`https://hackmd.io/${post.id}/download`).then((res) => res.text());
    // strip out the frontmatter
    const { content, data } = matter(fullContent);
    const filePath = path.join(postsDir, `${post.shortId}.md`);

    return {
      ...post,
      filePath,
      content,
      data,
    };
  }));

  // generate gemtext
  const getDate = (post) => {
    let rawDate = post.data?.date || post.publishedAt || post.createdAt

    return new Date(rawDate).valueOf()
  }

  const sortedPosts = posts.sort((a, b) => {
    return getDate(b) - getDate(a)
  })

  sortedPosts.forEach((post) => {
    // fs.unlinkSync(post.filePath);
    fs.writeFileSync(post.filePath, post.content, 'utf8');
  });

  const indexContent = generateIndex(sortedPosts);
  const indexFilePath = path.join(outputDir, `index.gmi`);

  fs.unlinkSync(indexFilePath);
  fs.writeFileSync(path.join(outputDir, `index.gmi`), indexContent, 'utf8');
}

function generateIndex(posts) {
  const links = posts
    .map((post) => {
      return `=> ./${post.shortId}.gmi ${post.title}`;
    })
    .join("\n");

  return `# DailyOops

${links}
`;
}

run();
