const ENDPOINTS = {
  products: "https://deisishop.pythonanywhere.com/products",
  categories: "https://deisishop.pythonanywhere.com/categories",
};

const STORAGE_KEY = "produtos-selecionados";
const $ = (s) => document.querySelector(s);
const formatPrice = (n) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" })
    .format(Number(n) || 0);

let produtosOriginais = [];
let produtosVisiveis = [];

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, "[]");
  wireControls();
  carregarCategorias();
  carregarProdutos();
  atualizarCesto();
  atualizarTotal();
});

const readCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const writeCart = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

function carregarCategorias() {
  fetch(ENDPOINTS.categories)
    .then((response) => response.json())
    .then((categorias) => {
      const sel = $("#categoria");
      sel.querySelectorAll("option:not(:first-child)").forEach(o => o.remove());
      categorias.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = String(cat);
        opt.textContent = cat;
        sel.append(opt);
      });
    })
    .catch((error) => console.error("Erro categorias:", error));
}

function carregarProdutos() {
  fetch(ENDPOINTS.products)
    .then((response) => response.json())
    .then((dados) => {
      produtosOriginais = Array.isArray(dados) ? dados : (dados.results || []);
      produtosVisiveis = [...produtosOriginais];
      aplicarControles();
      atualizarTotal();
    })
    .catch((error) => {
      console.error("Erro produtos:", error);
      $("#lista-produtos").innerHTML = `<p class="vazio">Não foi possível carregar os produtos.</p>`;
    });
}

function wireControls() {
  $("#categoria")?.addEventListener("change", aplicarControles);
  $("#ordem")?.addEventListener("change", aplicarControles);
  $("#q")?.addEventListener("input", aplicarControles);
}

function aplicarControles() {
  const cat = ($("#categoria")?.value || "").trim();
  const ordem = ($("#ordem")?.value || "").trim();
  const termo = ($("#q")?.value || "").trim().toLowerCase();

  let lista = cat
    ? produtosOriginais.filter(p => String(p.category ?? "").toLowerCase() === cat.toLowerCase())
    : [...produtosOriginais];

  if (termo) {
    lista = lista.filter(p =>
      String(p.title ?? "").toLowerCase().includes(termo) ||
      String(p.description ?? "").toLowerCase().includes(termo)
    );
  }

  if (ordem === "asc") lista.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (ordem === "desc") lista.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  produtosVisiveis = lista;
  renderLista(lista);
}

function renderLista(lista) {
  const mount = $("#lista-produtos");
  mount.textContent = "";

  if (!Array.isArray(lista) || !lista.length) {
    mount.innerHTML = `<p class="vazio">Sem produtos para mostrar.</p>`;
    return;
  }

  const tpl = $("#tpl-produto");
  lista.forEach((produto) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const img = node.querySelector("img");
    if (img) {
      img.src = produto.image;
      img.alt = produto.title || "";
      img.loading = "lazy";
    }
    node.querySelector(".titulo").textContent = produto.title ?? "—";
    node.querySelector(".descricao").textContent = produto.description ?? "";
    node.querySelector(".preco").textContent = formatPrice(produto.price);
    node.querySelector('[data-acao="add"]').addEventListener("click", () => {
      const carrinho = readCart();
      if (!carrinho.some(it => it.id === produto.id)) {
        carrinho.push(produto);
        writeCart(carrinho);
        atualizarCesto();
        atualizarTotal();
      }
    });
    mount.append(node);
  });
}

function atualizarCesto() {
  const mount = $("#lista-cesto");
  mount.textContent = "";
  const cart = readCart();
  if (!cart.length) {
    mount.innerHTML = `<p class="vazio">Ainda não adicionou produtos.</p>`;
    return;
  }
  cart.forEach((p) => {
    const art = document.createElement("article");
    const header = document.createElement("header");
    const h4 = document.createElement("h4");
    h4.textContent = p.title ?? "—";
    header.appendChild(h4);
    const preco = document.createElement("p");
    preco.textContent = formatPrice(p.price);
    const footer = document.createElement("footer");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Remover";
    btn.addEventListener("click", () => {
      const lista = readCart();
      const i = lista.findIndex(it => it.id === p.id);
      if (i > -1) {
        lista.splice(i, 1);
        writeCart(lista);
        atualizarCesto();
        atualizarTotal();
      }
    });
    footer.appendChild(btn);
    art.append(header, preco, footer);
    mount.append(art);
  });
}

function atualizarTotal() {
  const total = readCart().reduce((s, p) => s + (Number(p.price) || 0), 0);
  $("#total").textContent = "Total: " + formatPrice(total);
}
