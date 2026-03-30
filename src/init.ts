import { select } from "@inquirer/prompts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { copySpecBotTemplates, copyTemplates, writeProjectConfig } from "./generate.js";

/** Package root (where package.json and templates/ live). When running from dist/init.js, one level up from dist. */
function getPackageRoot(): string {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(dir, "..");
}

/** Copy templates/cursor to target .cursor if the templates dir exists. */
function copyCursorTemplates(cwd: string, targetDir: string): boolean {
  const root = getPackageRoot();
  const templatesCursor = path.join(root, "templates", "cursor");
  if (!fs.existsSync(templatesCursor)) return false;
  fs.cpSync(templatesCursor, targetDir, { recursive: true });
  return true;
}

export type AiToolId = "cursor" | "claude" | "github-copilot" | "agent";

export const AI_TOOLS: { value: AiToolId; name: string; folder: string }[] = [
  { value: "cursor", name: "Cursor", folder: ".cursor" },
  { value: "claude", name: "Claude (Anthropic)", folder: ".claude" },
  { value: "github-copilot", name: "GitHub Copilot", folder: ".github-copilot" },
  { value: "agent", name: "Agent (.agent)", folder: ".agent" },
];

const SCAFFOLD: Record<AiToolId, { files: Record<string, string> }> = {
  cursor: {
    files: {
      "rules/README.md": `# Cursor rules (spec-bot)

Context-aware workflow rules and commands will be generated here by spec-bot.
Do not remove this folder.
`,
    },
  },
  claude: {
    files: {
      "README.md": `# Claude context (spec-bot)

Context-aware prompts and project context will be generated here by spec-bot.
`,
    },
  },
  "github-copilot": {
    files: {
      "README.md": `# GitHub Copilot context (spec-bot)

Context-aware instructions will be generated here by spec-bot.
`,
    },
  },
  agent: {
    files: {
      "README.md": `# Agent context (spec-bot)

Context-aware workflow context will be generated here by spec-bot.
`,
    },
  },
};

const VALID_IDS = new Set<AiToolId>(["cursor", "claude", "github-copilot", "agent"]);

export async function runInit(
  cwd: string,
  toolId?: AiToolId
): Promise<void> {
  let chosen: AiToolId;
  if (toolId) {
    if (!VALID_IDS.has(toolId)) {
      console.error("Invalid --tool. Use: cursor | claude | github-copilot | agent");
      process.exit(1);
    }
    chosen = toolId;
  } else {
    chosen = await select({
      message: "Select AI tool to generate context-aware commands for:",
      choices: AI_TOOLS.map((t) => ({ value: t.value, name: t.name })),
      default: "cursor",
    });
  }

  const tool = AI_TOOLS.find((t) => t.value === chosen)!;
  const rootDir = path.resolve(cwd, tool.folder);

  if (fs.existsSync(rootDir)) {
    writeProjectConfig(cwd, { aiTool: chosen });
    copyTemplates(cwd, chosen);
    copySpecBotTemplates(cwd);
    console.log(`\n${tool.folder}/ already exists. Templates refreshed.`);
    return;
  }

  if (chosen === "cursor" && copyCursorTemplates(cwd, rootDir)) {
    // Cursor: full scaffold from templates (rules/ + commands/spec-bot/) already copied
  } else {
    const scaffold = SCAFFOLD[chosen as AiToolId];
    for (const [relativePath, content] of Object.entries(scaffold.files)) {
      const fullPath = path.join(rootDir, relativePath);
      const dir = path.dirname(fullPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, content, "utf-8");
    }
  }

  writeProjectConfig(cwd, { aiTool: chosen });
  copyTemplates(cwd, chosen);
  copySpecBotTemplates(cwd);

  console.log(`\nCreated ${tool.folder}/ and spec-bot/ with templates for ${tool.name}.`);
  console.log(`Your AI agent uses the copied .md files for workflow. Use \`spec-bot generate\` to refresh templates.\n`);
}
