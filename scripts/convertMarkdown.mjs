import { execSync } from "child_process";
import fg from "fast-glob";
import path from "path"
import { URL } from 'node:url'

try {
  execSync("gemgen -v", { stdio: "ignore" });
} catch (e) {
  console.error("gemgen executable is not installed");
  process.exit(1);
}

const __dirname = new URL('.', import.meta.url).pathname;
const postsDir = path.join(__dirname, "../content/posts");
const outputDir = path.join(__dirname, "../output");

function run() {
  const posts = fg.globSync("*.md", { cwd: postsDir });

  // convert markdown to gemtext
  posts.forEach((post) => {
    const input = path.join(postsDir, post)
    execSync(`gemgen ${input} -o ${outputDir} -e markdown`)
  });
}

run()
