import fetch from "node-fetch"
import dotenv from "dotenv"
import path from 'path'
import fs from 'fs'
import matter from "gray-matter"
import { URL } from 'node:url'
import markdownIt from 'markdown-it'

dotenv.config();

const __dirname = new URL('.', import.meta.url).pathname;
const postsDir = path.join(__dirname, "../content/posts");
const outputDir = path.join(__dirname, "../output");

const md = markdownIt()

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

  const getTitle = (post) => {
    const tokens = md.parse(post.content, {})

    for (const i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const nextContent = tokens[i + 1]?.content
      if (token.tag === 'h1') {
        return nextContent
      }
    }

    return 'Untitled'
  }

  sortedPosts.forEach((post) => {
    const content = `
---
date: ${new Date(getDate(post)).toISOString()}
title: ${getTitle(post)}
---
${post.content}`
    fs.writeFileSync(post.filePath, content, 'utf8');
  });

  fs.writeFileSync(path.join(outputDir, `index.gmi`), generateIndex(sortedPosts), 'utf8');
  fs.writeFileSync(path.join(postsDir, `_index.md`), generateIndexMd(sortedPosts), 'utf8');
}

function generateIndex(posts) {
  const links = posts
    .map((post) => {
      return `=> ./${post.shortId}.gmi ${post.title}`;
    })
    .join("\n");

  return `# DailyOops

Welcome to gemini capsule of my blog.
There is also a plain HTML version that You can use.

=> https://yukai.dev Daily Oops
=> https://txtyukai.dev Daily Oops (Plain HTML version)

${links}
`;
}

function generateIndexMd(posts) {
  const links = posts
    .map((post) => {
      return `- [${post.title}](./${post.shortId})`;
    })
    .join("\n");

  return `# DailyOops

${links}
`
}

run();
