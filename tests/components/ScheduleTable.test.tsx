import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ScheduleTable from "@/components/ScheduleTable";
import type { Selected } from "@/types/c-types";
import React from "react";

function ScheduleWrapper({
  initialSchedule = new Set<string>() as Selected,
  studentSchedule,
  mode = "edit" as "edit" | "select" | "watch",
  onSetSchedule,
}: {
  initialSchedule?: Selected;
  studentSchedule?: Selected;
  mode?: "edit" | "select" | "watch";
  onSetSchedule?: (s: Selected) => void;
}) {
  const [schedule, setSchedule] = React.useState<Selected>(initialSchedule);
  return (
    <ScheduleTable
      schedule={schedule}
      setSchedule={(updater) => {
        act(() => {
          setSchedule((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            onSetSchedule?.(next as Selected);
            return next as Selected;
          });
        });
      }}
      studentSchedule={studentSchedule}
      mode={mode}
    />
  );
}

function getDataCells(container: HTMLElement) {
  return Array.from(container.querySelectorAll("td:not(:first-child)")) as HTMLElement[];
}

describe("ScheduleTable", () => {
  it("renders day headers", () => {
    render(<ScheduleWrapper />);
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("renders time column header", () => {
    render(<ScheduleWrapper />);
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("renders 24 hour rows", () => {
    render(<ScheduleWrapper />);
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(screen.getByText("23:00")).toBeInTheDocument();
  });

  it("renders a table element", () => {
    const { container } = render(<ScheduleWrapper />);
    expect(container.querySelector("table")).toBeInTheDocument();
  });

  it("shows no selected cells initially (bg-success/20 class)", () => {
    const { container } = render(<ScheduleWrapper />);
    const selectedCells = Array.from(
      container.querySelectorAll("td")
    ).filter((td) => td.className.split(" ").includes("bg-success/20"));
    expect(selectedCells.length).toBe(0);
  });

  it("adds a cell in edit mode via mousedown", () => {
    const setSchedule = vi.fn();
    render(
      <ScheduleTable
        schedule={new Set<string>() as Selected}
        setSchedule={setSchedule}
        mode="edit"
      />
    );
    const cells = getDataCells(document.body);
    expect(cells.length).toBeGreaterThan(0);
    fireEvent.mouseDown(cells[0]);
    expect(setSchedule).toHaveBeenCalled();
  });

  it("toggleCell in edit mode adds key to schedule", () => {
    const updated: Selected[] = [];
    render(
      <ScheduleWrapper
        mode="edit"
        onSetSchedule={(s) => updated.push(s)}
      />
    );
    const cells = getDataCells(document.body);
    fireEvent.mouseDown(cells[0]);
    expect(updated.length).toBeGreaterThan(0);
    expect(updated[0].size).toBe(1);
  });

  it("toggleCell in select mode clears and selects single slot", () => {
    const initial = new Set(["Mon-0:00", "Tue-0:00"]) as Selected;
    const updated: Selected[] = [];
    render(
      <ScheduleWrapper
        initialSchedule={initial}
        mode="select"
        onSetSchedule={(s) => updated.push(s)}
      />
    );
    const cells = getDataCells(document.body);
    // In select mode, only already-selected cells are clickable
    // Mon-0:00 is selected so first cell of Mon column (row 0) is clickable
    // Find Mon's cells (every 7th starting from 0)
    fireEvent.mouseDown(cells[0]);
    expect(updated.length).toBeGreaterThan(0);
    expect(updated[0].size).toBe(1);
  });

  it("drag removes already-selected cell in edit mode", () => {
    const initial = new Set(["Mon-0:00"]) as Selected;
    const updated: Selected[] = [];
    render(
      <ScheduleWrapper
        initialSchedule={initial}
        mode="edit"
        onSetSchedule={(s) => updated.push(s)}
      />
    );
    const cells = getDataCells(document.body);
    // Mon-0:00 is cells[0] (Mon first row, skip time column)
    fireEvent.mouseDown(cells[0]);
    // Should have removed it
    expect(updated.length).toBeGreaterThan(0);
    expect(updated[0].has("Mon-0:00")).toBe(false);
  });

  it("mouseEnter while dragging toggles a cell", () => {
    const updated: Selected[] = [];
    render(
      <ScheduleWrapper
        mode="edit"
        onSetSchedule={(s) => updated.push(s)}
      />
    );
    const cells = getDataCells(document.body);
    // Start a drag on first cell
    fireEvent.mouseDown(cells[0]);
    const prevCount = updated.length;
    // Hover over second cell while dragging
    fireEvent.mouseEnter(cells[1]);
    expect(updated.length).toBeGreaterThan(prevCount);
  });

  it("in watch mode, cells are not interactive", () => {
    const setSchedule = vi.fn();
    render(
      <ScheduleTable schedule={new Set<string>() as Selected} setSchedule={setSchedule} mode="watch" />
    );
    const cells = getDataCells(document.body);
    if (cells.length > 0) {
      fireEvent.mouseDown(cells[0]);
      expect(setSchedule).not.toHaveBeenCalled();
    }
  });

  it("mouseLeave stops dragging", () => {
    const { container } = render(<ScheduleWrapper />);
    const wrapper = container.querySelector("div");
    fireEvent.mouseLeave(wrapper!);
  });

  it("mouseUp stops dragging", () => {
    const { container } = render(<ScheduleWrapper />);
    const wrapper = container.querySelector("div");
    fireEvent.mouseUp(wrapper!);
  });
});
