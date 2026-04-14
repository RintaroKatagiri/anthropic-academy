import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create shows Creating with filename", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Editing with filename", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "Card.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor insert shows Editing with filename", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "Card.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor view shows Viewing with filename", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "App.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Viewing App.jsx")).toBeDefined();
});

test("file_manager rename shows Renaming with filename", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "rename", path: "OldName.jsx", new_path: "NewName.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Renaming OldName.jsx")).toBeDefined();
});

test("file_manager delete shows Deleting with filename", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "delete", path: "OldName.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Deleting OldName.jsx")).toBeDefined();
});

test("unknown tool falls back to toolName", () => {
  render(
    <ToolInvocationBadge
      toolName="some_other_tool"
      args={{}}
      state="result"
    />
  );
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("path with directories shows only basename", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/components/Card.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
});

test("non-result state shows spinner, not green dot", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("result state shows green dot, not spinner", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
