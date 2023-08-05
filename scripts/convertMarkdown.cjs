const { execSync } = require("child_process");
const fg = require("fast-glob");
const path = require("path");

try {
  execSync("gemgen -v", { stdio: "ignore" });
} catch (e) {
  console.error("gemgen executable is not installed");
  process.exit(1);
}

const postsDir = path.join(__dirname, "../posts");
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
