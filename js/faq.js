document.addEventListener("DOMContentLoaded", () => {
  
  // Seleciona todos os itens de FAQ
  const itensFaq = document.querySelectorAll(".item-faq")

  // Adiciona evento de clique para cada item
  itensFaq.forEach((item) => {
    const pergunta = item.querySelector(".pergunta-faq")

    pergunta.addEventListener("click", () => {
      // Verifica se o item clicado já está ativo
      const estaAtivo = item.classList.contains("ativo")

      // Fecha todos os itens
      itensFaq.forEach((outroItem) => {
        outroItem.classList.remove("ativo")
      })

      // Se o item clicado não estava ativo, abre-o
      if (!estaAtivo) {
        item.classList.add("ativo")
      }
    })
  })

  // Função para o menu mobile
  const botaoMenuMobile = document.querySelector(".botao-menu-mobile")
  const navegacaoDesktop = document.querySelector(".navegacao-desktop")

  if (botaoMenuMobile) {
    botaoMenuMobile.addEventListener("click", () => {
      navegacaoDesktop.classList.toggle("visivel")
    })
  }
})
