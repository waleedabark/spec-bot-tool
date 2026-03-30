import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AiToolId } from "./init.js";
import { AI_TOOLS } from "./init.js";

const SPEC_BOT_CONFIG = ".spec-bot.json";

export interface SpecBotConfig {
  aiTool: AiToolId;
}

export function getProjectConfig(cwd: string): SpecBotConfig | null {
  const configPath = path.join(cwd, SPEC_BOT_CONFIG);
  if (!fs.existsSync(configPath)) return null;
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const data = JSON.parse(raw) as unknown;
    if (data && typeof data === "object" && "aiTool" in data && typeof (data as SpecBotConfig).aiTool === "string") {
      return data as SpecBotConfig;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeProjectConfig(cwd: string, config: SpecBotConfig): void {
  const configPath = path.join(cwd, SPEC_BOT_CONFIG);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

function getPackageRoot(): string {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(dir, "..");
}

/** Copy templates/spec-bot into project (product/, specs/, standards/, state.json, context.md, WORKFLOW.md). */
export function copySpecBotTemplates(cwd: string): void {
  const root = getPackageRoot();
  const templatesSpecBot = path.join(root, "templates", "spec-bot");
  if (!fs.existsSync(templatesSpecBot)) return;
  const target = path.resolve(cwd, "spec-bot");
  fs.cpSync(templatesSpecBot, target, { recursive: true });
}

/** Copy templates for the given tool into the project. No state or dynamic content. */
export function copyTemplates(cwd: string, toolId: AiToolId): void {
  const root = getPackageRoot();
  const tool = AI_TOOLS.find((t) => t.value === toolId)!;
  const targetDir = path.resolve(cwd, tool.folder);

  if (toolId === "cursor") {
    const templatesCursor = path.join(root, "templates", "cursor");
    if (fs.existsSync(templatesCursor)) {
      fs.cpSync(templatesCursor, targetDir, { recursive: true });
      return;
    }
  }

  fs.mkdirSync(targetDir, { recursive: true });
  const readme = `# Spec-bot context (${tool.name})

This project uses spec-bot. Read \`spec-bot/product/\`, \`spec-bot/specs/\`, and \`spec-bot/state.json\` for context.

Workflow: Project Planner → Spec definitions → Feature breakdown → Task creation → Tester (QA).
`;
  fs.writeFileSync(path.join(targetDir, "spec-bot-context.md"), readme, "utf-8");
}

export function runGenerate(cwd: string, toolId?: AiToolId): boolean {
  const config = getProjectConfig(cwd);
  const resolvedTool = toolId ?? config?.aiTool;
  if (!resolvedTool) {
    console.error("No AI tool selected. Run `spec-bot init` first or pass --tool <id>.");
    return false;
  }
  copyTemplates(cwd, resolvedTool);
  copySpecBotTemplates(cwd);
  const tool = AI_TOOLS.find((t) => t.value === resolvedTool)!;
  console.log(`Templates copied for ${tool.name} into ${tool.folder}/ and spec-bot/.\n`);
  return true;
}
