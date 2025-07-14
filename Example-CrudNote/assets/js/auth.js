// auth.js
export function getCurrentUser() {
  const session = sessionStorage.getItem("user");
  return session ? JSON.parse(session) : null;
}

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "./login/login.html";
  }
  return user;
}

export function logout() {
  sessionStorage.clear();
  window.location.href = "./login/login.html";
}

