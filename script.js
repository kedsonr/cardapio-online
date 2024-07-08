const menu = document.getElementById("menu");
const cardBtn = document.getElementById("card-btn");
const cardModal = document.getElementById("card-modal");
const cardItemsContainer = document.getElementById("card-items");
const cardTotal = document.getElementById("card-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeBtn = document.getElementById("close-modal-btn");
const cardCounter = document.getElementById("card-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let card = [];

// abrir modal 
cardBtn.addEventListener("click", function () {
    updateCardModal()
    cardModal.style.display = "flex";
}),

    // fechar modal quando click fora
    cardModal.addEventListener("click", function (event) {
        if (event.target === cardModal) {
            cardModal.style.display = "none";
        }
    }),

    // fecha modal no botão
    closeBtn.addEventListener("click", function () {
        cardModal.style.display = "none";
    }),

    menu.addEventListener("click", function (event) {
        // console.log(event.target)
        let parentButton = event.target.closest(".add-to-card-btn");
        if (parentButton) {
            const name = parentButton.getAttribute("data-name");
            const price = parseFloat(parentButton.getAttribute("data-price"));

            addToCard(name, price)
        }

    })

function addToCard(name, price) {
    const existeItem = card.find(item => item.name === name)
    if (existeItem) {
        //se ja existe, aumenta a quantidade + 1
        existeItem.quantity += 1
    } else {
        card.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCardModal()
}

//atualza o carrinho

function updateCardModal() {
    cardItemsContainer.innerHTML = "";
    let total = 0;

    card.forEach(item => {
        const cardItemElement = document.createElement("div");
        cardItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cardItemElement.innerHTML = `
    <div class="flex items-center justify-between"> 
        <div> 
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium" >${item.price.toFixed(2)}</p>
        </div>

        
            <button class="remover-btn" data-name="${item.name}">
                Remover
            </buttton>
    
    </div>
    `
        total += item.price * item.quantity;

        cardItemsContainer.appendChild(cardItemElement)
    })

    cardTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cardCounter.innerHTML = card.length;
}

// remover do carrinho

cardItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remover-btn")) {
        const name = event.target.getAttribute("data-name")
        removerItem(name)
    }
})

function removerItem(name) {
    const index = card.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = card[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCardModal();
            return;
        }

        card.splice(index, 1);
        updateCardModal();
    }
}

// input de Endereço
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    //validaçao
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
// finaliza pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkFuncionamento();
    if(!isOpen){
        Toastify({
            text: "Loja Fechada no Momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
       
       return; 
    }

    if (card.length === 0) return;
    //validaçao
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido no whatsapp
    const cardItems = card.map((item) => {
        return (
            `${item.name} Quantidade:(${item.quantity}) Preço: R$ ${item.price}  |  `
        )
    }).join("")
    const message = encodeURIComponent(cardItems)
    const phone = "61998287364"
    window.open(`https://wa.me/${phone}?text=${message} endereço: ${addressInput.value}`, "_blank")
    
    card = [];
    inputValue = [];
    updateCardModal();
})

//verificaçao da hora e manupular o card horario
function checkFuncionamento() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
    //hora = loja aberta
}
const spanItem = document.getElementById("data-span");
const isOpen = checkFuncionamento();

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}