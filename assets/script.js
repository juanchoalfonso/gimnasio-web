// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Carrito
let carrito = [];
const contador = document.getElementById('carrito-contador');
const lista = document.getElementById('carrito-lista');
const finalizar = document.getElementById('carrito-finalizar');

function updateCarrito() {
  contador.textContent = carrito.length;
  lista.innerHTML = carrito.length ? carrito.map(item => `<li>${item}</li>`).join('') : '<li vacíos>Carrito vacío</li>';
}

document.querySelectorAll('.add-carrito').forEach(btn => {
  btn.addEventListener('click', () => {
    carrito.push(btn.dataset.producto);
    updateCarrito();
  });
});

finalizar.addEventListener('click', () => {
  if (!carrito.length) return;
  const msg = 'Hola! Quiero estos productos del shop:\n\n' + carrito.join('\n');
  window.open(`https://wa.me/TU_NUMERO_AQUI?text=${encodeURIComponent(msg)}`);
  carrito = [];
  updateCarrito();
});
