const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const nextBin = require.resolve("next/dist/bin/next");
const compatPath = path.resolve(projectRoot, "node-compat.cjs").replace(/\\/g, "/");
const compatOption = `--require "${compatPath}"`;

function parseArgs(argv) {
  let daemon = false;
  let logFile = "logs.txt";
  const nextArgs = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--daemon") {
      daemon = true;
      continue;
    }

    if (arg === "--log-file") {
      logFile = argv[i + 1];
      i += 1;
      continue;
    }

    nextArgs.push(arg);
  }

  return { daemon, logFile, nextArgs };
}

function createNodeOptions() {
  const existing = process.env.NODE_OPTIONS?.trim();

  if (!existing) {
    return compatOption;
  }

  if (existing.includes("node-compat.cjs")) {
    return existing;
  }

  return `${existing} ${compatOption}`;
}

function usage() {
  console.error("Usage: node scripts/run-next.cjs [--daemon] [--log-file <path>] <next args...>");
  process.exit(1);
}

const { daemon, logFile, nextArgs } = parseArgs(process.argv.slice(2));

if (nextArgs.length === 0) {
  usage();
}

const env = {
  ...process.env,
  NODE_OPTIONS: createNodeOptions(),
};

const childArgs = [nextBin, ...nextArgs];

if (daemon) {
  const logPath = path.resolve(projectRoot, logFile);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const output = fs.openSync(logPath, "a");

  const child = spawn(process.execPath, childArgs, {
    cwd: projectRoot,
    detached: true,
    env,
    stdio: ["ignore", output, output],
    windowsHide: true,
  });

  child.unref();
  console.log(`Server started in background. Logs: ${path.relative(projectRoot, logPath)}`);
  process.exit(0);
}

const child = spawn(process.execPath, childArgs, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
