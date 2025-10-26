document.getElementById("btnClick").addEventListener("click", function() {
      alert("Clicaste no botão!");
    });
    document.getElementById("btnDblClick").addEventListener("dblclick", function() {
      alert("Fizeste duplo clique!");
    });
    const btnHover = document.getElementById("btnHover");
    btnHover.addEventListener("mouseover", function() {
      btnHover.style.backgroundColor = "green";
      btnHover.textContent = "Estás sobre mim!";
    });
  
    btnHover.addEventListener("mouseout", function() {
      btnHover.style.backgroundColor = "#008cba";
      btnHover.textContent = "Passa o rato aqui";
    });
    const img = document.getElementById("imagem");
    const coords = document.getElementById("coords");


    let body = document.querySelector("body");

    document.getElementById("btnMudacor").addEventListener("click", function() {
  
    let currentColor = window.getComputedStyle(body).backgroundColor;

 
    if (currentColor === "rgb(249, 249, 249)") { 
      body.style.backgroundColor = "blue";
    } else {
      body.style.backgroundColor = "#f9f9f9";
    }
    });

    img.addEventListener("mousemove", function(event) {
      coords.textContent = `Coordenadas do rato → X: ${event.offsetX}, Y: ${event.offsetY}`;
    });

    img.addEventListener("mouseout", function() {
      coords.textContent = "Move o rato sobre a imagem para ver as coordenadas.";
    });