export const classNameBody = "min-h-screen flex flex-col";

export const classNameMain = "flex-1 overflow-y-auto flex flex-col py-4";

export const classNameFooter = "";

export function getScheduleCellClass(
  isStudentSelected: boolean,
  isSelected: boolean,
  isClickable: boolean,
  mode: "edit" | "select" | "watch",
): string {
  const base = "transition-colors duration-150";

  if (isStudentSelected) {
    return `${base} bg-primary/40 ${isClickable ? "cursor-pointer hover:bg-primary/55" : "cursor-default"}`;
  }
  if (isSelected) {
    return `${base} bg-success/20 ${isClickable ? "cursor-pointer hover:bg-success/35" : "cursor-default"}`;
  }
  if (mode === "watch") {
    return `${base} bg-base-300/30 cursor-default`;
  }
  return `${base} bg-base-300/20 ${isClickable ? "cursor-pointer hover:bg-success/15" : "cursor-default"}`;
}
