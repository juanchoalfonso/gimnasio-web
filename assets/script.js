// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Carrito simple
let carrito = [];
const contador = document.getElementById('contador-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const finalizarBtn = document.getElementById('finalizar-pedido');

function actualizarCarrito() {
  contador.textContent = carrito.length;
  listaCarrito.innerHTML = '';
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p>Carrito vacío</p>';
  } else {
    carrito.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      listaCarrito.appendChild(li);
    });
  }
}

document.querySelectorAll('.agregar-carrito').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const producto = this.getAttribute('data-producto');
    carrito.push(producto);
    actualizarCarrito();
  });
});

finalizarBtn.addEventListener('click', () => {
  if (carrito.length === 0) return alert('Carrito vacío');
  const mensaje = 'Hola, quiero estos productos:\n' + carrito.join('\n');
  window.open(`https://wa.me/TU_NUMERO_AQUI?text=${encodeURIComponent(mensaje)}`);
  carrito = [];
  actualizarCarrito();
});
