document.addEventListener("DOMContentLoaded", () => {
    
    const apiUrl = "http://localhost:3000/";

    const userInput = document.getElementById("user");
    const passwordInput = document.getElementById("password");
    const signIn = document.getElementById("signIn");

    async function searchUsers() {
    const res = await fetch(apiUrl + "user");
    return await res.json();
    }

    async function LoginUser() {
    try {
        const userValue = userInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (userValue === "" || passwordValue === "") {
        alert("Por favor, completa todos los campos.");
        return;
        }

        const users = await searchUsers();

      // Buscar usuario por correo o username
        const foundUser = users.find(
        user => user.email === userValue || user.userName === userValue
        );

        if (!foundUser) {
        alert("Usuario no encontrado");
        return;
        }

        if (foundUser.password !== passwordValue) {
        alert("Contraseña incorrecta");
        return;
        }

      // Inicio de sesión exitoso
        alert("Inicio de sesión exitoso");

      // Guardar en sessionStorage
        sessionStorage.setItem("user", JSON.stringify(foundUser.name));

      // Redirigir a notas
        window.location.href = "../index.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
    }

    signIn.addEventListener("click", (e) => {
    e.preventDefault();
    LoginUser();
    });
});