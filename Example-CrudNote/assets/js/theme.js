export function applyTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  const body = document.getElementById("body");

  if (isDark) {
    body.classList.add("bg-dark", "text-light");
    body.classList.remove("bg-light", "text-dark");
    document.getElementById("theme-toggle").checked = true;
  } else {
    body.classList.add("bg-light", "text-dark");
    body.classList.remove("bg-dark", "text-light");
    document.getElementById("theme-toggle").checked = false;
  }
}

export function toggleTheme() {
  const isDark = document.getElementById("theme-toggle").checked;
  localStorage.setItem("theme", isDark ? "dark" : "light");
  applyTheme();
}