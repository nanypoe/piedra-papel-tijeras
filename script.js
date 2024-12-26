// Elección aleatoria de la computadora
function getEleccionComputadora() {
    const opciones = ["piedra", "papel", "tijeras"];
    const indiceAleatorio = Math.floor(Math.random() * opciones.length);
    const eleccion = opciones[indiceAleatorio];

    // Asociar las opciones con los botones de la computadora
    const botonesComputadora = {
        piedra: document.getElementById("cpu-piedra"),
        papel: document.getElementById("cpu-papel"),
        tijeras: document.getElementById("cpu-tijeras")
    };

    // Restablecer a los iconos de "misterio" antes de seleccionar nuevamente.
    Object.values(botonesComputadora).forEach(boton => {
        boton.innerHTML = '<i class="fas fa-question"></i>';
        boton.classList.add("text-gray-400");
        boton.classList.remove("text-blue-500", "text-green-500", "text-red-500");
    });

    // Actualizar el ícono del botón seleccionado
    const botonSeleccionado = botonesComputadora[eleccion];
    const iconos = {
        piedra: "fa-hand-rock",
        papel: "fa-hand-paper",
        tijeras: "fa-hand-scissors"
    };

    botonSeleccionado.innerHTML = `<i class="fas ${iconos[eleccion]}"></i>`;
    botonSeleccionado.classList.remove("text-gray-400");
    if (eleccion === "piedra") botonSeleccionado.classList.add("text-blue-500");
    if (eleccion === "papel") botonSeleccionado.classList.add("text-green-500");
    if (eleccion === "tijeras") botonSeleccionado.classList.add("text-red-500");

    return eleccion;
}

// Manejar eventos de los botones del jugador
document.querySelectorAll(".jugador button").forEach(button => {
    button.addEventListener("click", () => {
        toggleBotonesJugador(false);
        const eleccionJugador = button.id;
        const eleccionComputadora = getEleccionComputadora();

        // Añadir clases para mover los botones seleccionados
        const botonJugador = document.getElementById(eleccionJugador);
        const botonComputadora = document.getElementById(`cpu-${eleccionComputadora}`);

        // Clonar los botones para la animación
        const clonJugador = botonJugador.cloneNode(true);
        const clonComputadora = botonComputadora.cloneNode(true);

        // Mostrar los clones en el área de enfrentamiento
        const areaEnfrentamiento = document.getElementById("enfrentamiento");
        areaEnfrentamiento.innerHTML = ""; // Limpiar enfrentamiento previo
        areaEnfrentamiento.appendChild(clonJugador);
        areaEnfrentamiento.appendChild(clonComputadora);

        // Aplicar animación
        clonJugador.classList.add("move-to-center");
        clonComputadora.classList.add("move-to-center");

        // Determinar el resultado del juego y aplicar efectos
        const resultado = determinarGanador(eleccionJugador, eleccionComputadora);
        setTimeout(() => {
            if (resultado === "¡Empate!") {
                clonJugador.classList.add("empate"); // Ambos "ganan" visualmente
                clonComputadora.classList.add("empate");
            } else if (resultado === "¡Ganaste!") {
                clonJugador.classList.add("ganador");
                clonComputadora.classList.add("perdedor");
            } else {
                clonJugador.classList.add("perdedor");
                clonComputadora.classList.add("ganador");
            }

            // Mostrar el resultado
            document.getElementById("resultado").textContent =
                `Elegiste: ${eleccionJugador}. La computadora eligió: ${eleccionComputadora}. ${resultado}`;

            // Limpiar enfrentamiento después de un breve tiempo
            setTimeout(() => {
                areaEnfrentamiento.innerHTML = "";

                // Reactivar botones del jugador
                toggleBotonesJugador(true);
            }, 2000);
        }, 1000);

        // Reproducir sonido
        reproducirSonido(resultado);
    });
});


// Determinar el ganador
function determinarGanador(jugador, cpu) {
    if (jugador === cpu) {
        return "¡Empate!";
    }
    if ((jugador === "piedra" && cpu === "tijeras") ||
        (jugador === "papel" && cpu === "piedra") ||
        (jugador === "tijeras" && cpu === "papel")
    ) {
        return "¡Ganaste!";
    }
    return "¡La computadora ganó este round!";
}

// Función para reproducir sonidos según el resultado
function reproducirSonido(resultado) {
    const sonidos = {
        ganador: new Audio("fx/ganador.mp3"),
        perdedor: new Audio("fx/perdedor.mp3"),
        empate: new Audio("fx/empate.mp3")
    };

    if (resultado === "¡Empate!") {
        sonidos.empate.play();
    } else if (resultado === "¡Ganaste!") {
        sonidos.ganador.play();
    } else {
        sonidos.perdedor.play();
    }
}

// Función para habilitar o deshabilitar botones del jugador
function toggleBotonesJugador(habilitar) {
    document.querySelectorAll(".jugador button").forEach(boton => {
        boton.disabled = !habilitar;
        if (habilitar) {
            boton.classList.remove("cursor-not-allowed");
        } else {
            boton.classList.add("cursor-not-allowed");
        }
    });
}
