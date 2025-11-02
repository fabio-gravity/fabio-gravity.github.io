const KEY = "produtos-selecionados";

const formatPrice = (n) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);


const getCarrinho = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};
const setCarrinho = (lista) => localStorage.setItem(KEY, JSON.stringify(lista));

const ensureStorage = () => {
  if (!localStorage.getItem(KEY)) setCarrinho([]);
};

function ensureMounts() {

  const secProdutos = document.querySelector("#produtos") || document.body;
  let listaProdutos = document.querySelector("#lista-produtos");
  if (!listaProdutos) {
    listaProdutos = document.createElement("section");
    listaProdutos.id = "lista-produtos";
    listaProdutos.setAttribute("aria-live", "polite");
    secProdutos.appendChild(listaProdutos);
  }

  const secCesto = document.querySelector("#cesto") || document.body;
  let listaCesto = document.querySelector("#lista-cesto");
  if (!listaCesto) {
    listaCesto = document.createElement("section");
    listaCesto.id = "lista-cesto";
    listaCesto.setAttribute("aria-live", "polite");
    secCesto.appendChild(listaCesto);
  }

  if (!document.querySelector("#total-cesto")) {
    const total = document.createElement("p");
    total.id = "total-cesto";
    total.style.fontWeight = "700";
    total.style.padding = ".5rem 0";
    secCesto.prepend(total);
  }
}


function carregarProdutos(listaDeProdutos) {
  const mount = document.querySelector("#lista-produtos");
  mount.textContent = "";

  listaDeProdutos.forEach((produto) => {
    console.log(produto);           
    console.log(produto.id, produto.title); 
    const artigo = criarProduto(produto);
    mount.append(artigo);
  });
}

function criarProduto(produto) {
  const artigo = document.createElement("article");
  artigo.className = "produto";

   
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title || "Imagem do produto";
  img.loading = "lazy";
  figure.appendChild(img);

  const header = document.createElement("header");
  const h3 = document.createElement("h3");
  h3.textContent = produto.title;
  header.appendChild(h3);

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = produto.description;

  const preco = document.createElement("p");
  preco.className = "price";
  preco.textContent = formatPrice(produto.price);

  const footer = document.createElement("footer");
  const btnAdd = document.createElement("button");
  btnAdd.type = "button";
  btnAdd.textContent = "+ Adicionar ao cesto";

  btnAdd.addEventListener("click", () => {
    const carrinho = getCarrinho();
    carrinho.push(produto);         
    setCarrinho(carrinho);
    atualizaCesto();
  });

  footer.append(btnAdd);


  artigo.append(figure, header, desc, preco, footer);
  return artigo;
}

function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");
  artigo.className = "item-cesto";

  const header = document.createElement("header");
  const h4 = document.createElement("h4");
  h4.textContent = produto.title;
  header.appendChild(h4);

  const preco = document.createElement("p");
  preco.textContent = formatPrice(produto.price);

  const footer = document.createElement("footer");
  const btnRem = document.createElement("button");
  btnRem.type = "button";
  btnRem.textContent = "Remover";

  btnRem.addEventListener("click", () => {
    const carrinho = getCarrinho();
 
    const idx = carrinho.findIndex((p) => p.id === produto.id);
    if (idx > -1) {
      carrinho.splice(idx, 1); 
      setCarrinho(carrinho);
      atualizaCesto();
    }
  });

  footer.append(btnRem);

  artigo.append(header, preco, footer);
  return artigo;
}

function atualizaCesto() {
  const mount = document.querySelector("#lista-cesto");
  const totalEl = document.querySelector("#total-cesto");
  mount.textContent = ""; 

  const carrinho = getCarrinho();

  if (!carrinho.length) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Ainda não adicionou produtos.";
    mount.append(vazio);
    totalEl.textContent = "Total: " + formatPrice(0);
    return;
  }

  let total = 0;
  carrinho.forEach((produto) => {
    total += Number(produto.price) || 0;
    mount.append(criaProdutoCesto(produto));
  });

  totalEl.textContent = "Total: " + formatPrice(total);
}


document.addEventListener("DOMContentLoaded", () => {
  ensureStorage();
  ensureMounts();

  if (Array.isArray(produtos)) {
    carregarProdutos(produtos);
  } else {
    console.error("A variável `produtos` não está definida ou não é uma lista.");
  }

  atualizaCesto();
});
