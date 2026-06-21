/* =========================================================
   PORTAFOLIO — SOLEDAD FERNÁNDEZ
   JavaScript modular: cada función tiene una responsabilidad
   única y se inicializa al cargar el DOM.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
	initMenuMovil();
	initModoOscuro();
	initAvatarHover();
	initFormularioContacto();
	initBotonVolverArriba();
	initAnioFooter();
	initAnimacionesAlScroll();
});

/**
 * Controla la apertura/cierre del menú de navegación en móvil
 * y cierra el menú automáticamente al seleccionar un enlace.
 */
function initMenuMovil() {
	const boton = document.getElementById('navToggle');
	const menu = document.getElementById('navMenu');

	if (!boton || !menu) return;

	const cerrarMenu = () => {
		menu.classList.remove('is-open');
		boton.setAttribute('aria-expanded', 'false');
		boton.setAttribute('aria-label', 'Abrir menú de navegación');
	};

	const abrirMenu = () => {
		menu.classList.add('is-open');
		boton.setAttribute('aria-expanded', 'true');
		boton.setAttribute('aria-label', 'Cerrar menú de navegación');
	};

	boton.addEventListener('click', () => {
		const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
		estaAbierto ? cerrarMenu() : abrirMenu();
	});

	// Cierra el menú cada vez que se elige un enlace de navegación
	menu.querySelectorAll('.navbar__link').forEach((enlace) => {
		enlace.addEventListener('click', cerrarMenu);
	});

	// Permite cerrar el menú con la tecla Escape (accesibilidad por teclado)
	document.addEventListener('keydown', (evento) => {
		if (evento.key === 'Escape') cerrarMenu();
	});
}

/**
 * Cambia la foto de perfil al pasar el cursor por encima, y la
 * restaura al salir. Recupera el comportamiento original de la
 * página, ahora encapsulado como función independiente.
 */
function initAvatarHover() {
	const avatar = document.getElementById('miAvatar');
	if (!avatar) return;

	const FOTO_DEFECTO = 'img/perfil.png';
	const FOTO_HOVER = 'img/perfil-hover.jpg';

	avatar.addEventListener('mouseenter', () => {
		avatar.src = FOTO_HOVER;
	});

	avatar.addEventListener('mouseleave', () => {
		avatar.src = FOTO_DEFECTO;
	});
}

/**
 * Gestiona el modo claro/oscuro.
 * Recuerda la preferencia del usuario usando localStorage,
 * y respeta la preferencia del sistema si no hay nada guardado.
 */
function initModoOscuro() {
	const boton = document.getElementById('themeToggle');
	if (!boton) return;

	const CLAVE_ALMACENAMIENTO = 'sfernandez-tema';
	const prefiereOscuroSistema = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const temaGuardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);

	const activarOscuro = (activar) => {
		document.body.classList.toggle('dark-mode', activar);
		boton.setAttribute('aria-pressed', String(activar));
		boton.setAttribute('aria-label', activar ? 'Activar modo claro' : 'Activar modo oscuro');
	};

	// Estado inicial: respeta lo guardado, o si no existe, la preferencia del sistema
	const debeIniciarOscuro = temaGuardado ? temaGuardado === 'oscuro' : prefiereOscuroSistema;
	activarOscuro(debeIniciarOscuro);

	boton.addEventListener('click', () => {
		const nuevoEstado = !document.body.classList.contains('dark-mode');
		activarOscuro(nuevoEstado);
		localStorage.setItem(CLAVE_ALMACENAMIENTO, nuevoEstado ? 'oscuro' : 'claro');
	});
}

/**
 * Valida el formulario de contacto en tiempo real y al enviar.
 * No realiza envío real (no hay backend conectado): solo muestra
 * el mensaje de éxito y limpia el formulario.
 */
function initFormularioContacto() {
	const formulario = document.getElementById('formContacto');
	if (!formulario) return;

	const mensajeExito = document.getElementById('feedbackExito');
	const campos = formulario.querySelectorAll('input, textarea');

	const validarCampo = (campo) => {
		const contenedor = campo.closest('.form-field');
		if (!contenedor) return;
		contenedor.classList.toggle('is-invalid', !campo.checkValidity());
	};

	// Validación en tiempo real mientras el usuario escribe
	campos.forEach((campo) => {
		campo.addEventListener('input', () => validarCampo(campo));
		campo.addEventListener('blur', () => validarCampo(campo));
	});

	formulario.addEventListener('submit', (evento) => {
		evento.preventDefault();

		let formularioValido = true;
		campos.forEach((campo) => {
			validarCampo(campo);
			if (!campo.checkValidity()) formularioValido = false;
		});

		if (!formularioValido) {
			mensajeExito.hidden = true;
			return;
		}

		// Simulación de envío exitoso (sin backend real conectado)
		mensajeExito.hidden = false;
		formulario.reset();
		campos.forEach((campo) => campo.closest('.form-field')?.classList.remove('is-invalid'));

		// Oculta el mensaje de éxito automáticamente tras unos segundos
		setTimeout(() => {
			mensajeExito.hidden = true;
		}, 5000);
	});
}

/**
 * Muestra un botón flotante para volver al inicio de la página
 * cuando el usuario se desplaza hacia abajo, y desplaza con
 * scroll suave al hacer clic.
 */
function initBotonVolverArriba() {
	const boton = document.getElementById('backToTop');
	if (!boton) return;

	const UMBRAL_VISIBLE = 400; // píxeles de scroll antes de mostrar el botón

	window.addEventListener('scroll', () => {
		const debeMostrarse = window.scrollY > UMBRAL_VISIBLE;
		boton.hidden = false;
		boton.classList.toggle('is-visible', debeMostrarse);
	});

	boton.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

/**
 * Calcula y muestra el año actual en el footer automáticamente,
 * para no tener que actualizarlo manualmente cada año.
 */
function initAnioFooter() {
	const elementoAnio = document.getElementById('anioActual');
	if (!elementoAnio) return;
	elementoAnio.textContent = new Date().getFullYear();
}

/**
 * Aplica animaciones sutiles de aparición al hacer scroll,
 * usando IntersectionObserver para no perjudicar el rendimiento.
 * También anima el llenado de las barras de nivel en "Tecnologías".
 */
function initAnimacionesAlScroll() {
	const seccionesAnimables = document.querySelectorAll(
		'.section, .highlight-card, .learning-card, .project-card, .timeline__item'
	);
	const barrasDeNivel = document.querySelectorAll('.skill__fill');

	seccionesAnimables.forEach((el) => el.classList.add('reveal'));

	// Si el navegador no soporta IntersectionObserver, se muestra todo sin animar
	if (!('IntersectionObserver' in window)) {
		seccionesAnimables.forEach((el) => el.classList.add('is-visible'));
		barrasDeNivel.forEach((barra) => barra.classList.add('is-visible'));
		return;
	}

	const observador = new IntersectionObserver(
		(entradas, observer) => {
			entradas.forEach((entrada) => {
				if (entrada.isIntersecting) {
					entrada.target.classList.add('is-visible');
					observer.unobserve(entrada.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	seccionesAnimables.forEach((el) => observador.observe(el));
	barrasDeNivel.forEach((barra) => observador.observe(barra));
}