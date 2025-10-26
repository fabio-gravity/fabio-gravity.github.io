const primeiro = document.getElementById("primeiro");

primeiro.addEventListener("mouseover", function() {
  primeiro.textContent = "OBRIGADO POR PASSARES!";
});

primeiro.addEventListener("mouseout", function() {
  primeiro.textContent = "1. passa por aqui";
});
const segundo = document.getElementById("segundo");
const vermelho = document.getElementById("vermelho");
const azul = document.getElementById("azul");
const verde = document.getElementById("verde");
const preto = document.getElementById("preto");
vermelho.addEventListener("click", function(){
    segundo.style.color= "red";
})
azul.addEventListener("click", function(){
    segundo.style.color= "blue";
})
verde.addEventListener("click", function(){
    segundo.style.color= "green";
})
preto.addEventListener("click", function(){
    segundo.style.color= "black";
})

  const inputCor = document.getElementById("cor");


   const selectCouleur = document.getElementById("cor");

  inputCor.addEventListener("change", function() {
    const cor = inputCor.value;
    if (cor) {
      document.body.style.backgroundColor = cor;
    }
  });
    let count = 0;
    const conta = document.getElementById("conta");
    const btncontar = document.getElementById("btncontar");
    btncontar.addEventListener("click", function() {
        count++
        conta.textContent= count;
    });
const nome= document.getElementById("nome");
const idade = document.getElementById("idade");
const h2= document.getElementById("test");
const btnsub= document.getElementById(btnsub).addEventListener("click",function(){
  let a = nome.value;
  let b = idade.value;
  h2.textContent = "Olá, o " + a + " tem " + b + " anos!";

})
let comptado = 0; 
const affichagem = document.getElementById("comptador");

  document.addEventListener('DOMContentLoaded', () => {
  setInterval(() => {
    comptado++;
    affichagem.textContent = comptado;
  }, 1000);})