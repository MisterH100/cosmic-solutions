import '../css/cosmos.style.css'
const cosmosPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");

export const loadCosmosPage = () => {
  return (
    container.innerHTML = `
    `
  )
}
cosmosPage.innerHTML += loadCosmosPage()
