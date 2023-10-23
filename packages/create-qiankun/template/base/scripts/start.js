const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { spawn } = require("child_process");

const workspaceDir = path.resolve(__dirname, "../packages");

const childProcess = [];

fs.readdir(workspaceDir, async (err, dirs) => {
  const { projects } = await prompts([
    {
      name: "projects",
      type: "multiselect",
      message: "Select projects to start",
      choices: dirs.map((dir) => ({ title: dir, value: dir })),
    },
  ]);

  for (let dir of projects) {
    const child = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["run", "dev"],
      {
        cwd: path.join(workspaceDir, dir),
        stdio: "inherit",
      }
    );
    childProcess.push(child);
  }
});

process.on("exit", () => {
  childProcess.forEach((child) => {
    child.kill();
  });
});
