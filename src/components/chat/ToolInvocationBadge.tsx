"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : null;
  const basename = path ? path.split("/").pop() ?? path : null;
  const command = args.command;

  if (toolName === "str_replace_editor" && basename) {
    if (command === "create") return `Creating ${basename}`;
    if (command === "str_replace" || command === "insert" || command === "undo_edit") return `Editing ${basename}`;
    if (command === "view") return `Viewing ${basename}`;
  }

  if (toolName === "file_manager" && basename) {
    if (command === "rename") return `Renaming ${basename}`;
    if (command === "delete") return `Deleting ${basename}`;
  }

  return toolName;
}

export function ToolInvocationBadge({ toolName, args, state }: ToolInvocationBadgeProps) {
  const label = getLabel(toolName, args);
  const done = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
