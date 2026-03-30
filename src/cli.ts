#!/usr/bin/env node

import { Command } from "commander";
import { runGenerate } from "./generate.js";
import { runInit } from "./init.js";
import type { AiToolId } from "./init.js";

const program = new Command();

program
  .name("spec-bot")
  .description("Copy workflow templates into your project so your AI agent can follow the spec-bot workflow")
  .version("0.3.0");

program
  .command("init")
  .description("Select AI tool and copy templates (e.g. .cursor with rules and commands)")
  .option("-t, --tool <id>", "AI tool id: cursor | claude | github-copilot | agent (skips prompt)")
  .action(async (opts: { tool?: string }) => {
    const cwd = process.cwd();
    await runInit(cwd, opts.tool as AiToolId | undefined);
  });

program
  .command("generate")
  .description("Copy templates again (refresh from package; uses .spec-bot.json or --tool)")
  .option("-t, --tool <id>", "AI tool id: cursor | claude | github-copilot | agent")
  .action((opts: { tool?: string }) => {
    const cwd = process.cwd();
    const ok = runGenerate(cwd, opts.tool as AiToolId | undefined);
    if (!ok) process.exit(1);
  });

program.parse();
