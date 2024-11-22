const menu = document.getElementById('produtos');
const car_btn = document.getElementById('ic-cart');
const cartModal = document.getElementById('modal-cart');
const cart_items = document.getElementById('cart-items');
const cart_total = document.getElementById('total');
const checkout_btn = document.getElementById('finalizar-pedido');
const close_modal_btn = document.getElementById('close-modal-botao');
const cart_count = document.getElementById('quantidade');
const address = document.getElementById('address');
const address_warn = document.getElementById('address-warn');

let lista = [];

// Abrir o modal do carrinho de compras
car_btn.addEventListener("click", function() {
    cartModal.style.visibility = 'visible';
    updatecarrinho(); // Garantir que o modal esteja sempre atualizado
});

// Fechar o modal ao clicar fora
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.visibility = 'hidden';
    }
});

// Fechar o modal pelo botão "Fechar"
close_modal_btn.addEventListener("click", function() {
    cartModal.style.visibility = 'hidden';
});

// Adicionar ao carrinho
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest('.add-carrinho');

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parentButton.getAttribute("data-price");
        const image = parentButton.parentElement.querySelector(".celular").src;

        addToCart(name, price, image);
    }
});

// Função para adicionar ao carrinho
function addToCart(name, price, image) {
    const existingItem = lista.find(item => item.name === name);

    if (existingItem) {
        // Se o item já existe, aumenta apenas a quantidade
        existingItem.quantity += 1;
        return;
    } else {
        lista.push({
            name,
            price,
            image,
            quantity: 1,
        });
    }
    updatecarrinho();
}

// Atualizar o carrinho
function updatecarrinho() {
    cart_items.innerHTML = "";

    let total = 0;

    lista.forEach(item => {
        const cartItemElement = document.createElement("div");
        

        cartItemElement.innerHTML = `
        <div style="display: flex; align-items: center; gap:10px;justify-content:space-between;margin-top:10px;">
           
            <div style="display:flex" >
                <div>
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto; border-radius: 5px;">
                </div>
                <div>
                    <p>${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p>R$ ${item.price}</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; justify-content: space-between; ">
                <!-- Botão de diminuir quantidade -->
                <button class="decrease-quantity" data-name="${item.name}" style="padding: 5px 10px; cursor: pointer; font-size: 16px;">-</button>
                
                <!-- Quantidade do item -->
                <span style="font-size: 16px;">${item.quantity}</span>
                
                <!-- Botão de aumentar quantidade -->
                <button class="increase-quantity" data-name="${item.name}" style="padding: 5px 10px; cursor: pointer; font-size: 16px;">+</button>
                
                <!-- Botão de remover com ícone de lixeira -->
                <button class="remove-cell-car" data-name="${item.name}" style="display: flex; align-items: center; border: none; cursor: pointer; font-size: 16px; padding: 5px 10px; background-color: white; margin-left: auto;">
                    Remover
                    <i class="fa-solid fa-trash" alt="filled-trash" style="margin-left: 8px;"/></i>
                </button>
            </div>
        </div>
        `;

        total += item.price * item.quantity;

        cart_items.appendChild(cartItemElement);
    });

    cart_total.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cart_count.innerHTML = `(${lista.length})`;
}

cart_items.addEventListener("click",function(event){
   if(event.target.classList.contains("remove-cell-car")){
     const name = event.target.getAttribute("data-name");

     removeItemCart(name);
   }
})

function removeItemCart(name){
    const index = lista.findIndex(item => item.name === name)

    if(index !== -1){
       const item = lista[index];
       

       lista.splice(index,1); //remover o item da lista
       updatecarrinho()
    }

   
}


// Função para aumentar a quantidade de um item no carrinho
function increaseQuantity(name) {
    const item = lista.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        updatecarrinho();
    }
}

// Função para diminuir a quantidade de um item no carrinho
function decreaseQuantity(name) {
    const item = lista.find(item => item.name === name);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updatecarrinho();
    } else {
        // Se a quantidade for 1, remove o item
        removeItemCart(name);
    }
}



// Listener para eventos de clique dentro do carrinho
cart_items.addEventListener("click", function(event) {
    const name = event.target.getAttribute("data-name");

    if (event.target.classList.contains("increase-quantity")) {
        increaseQuantity(name);
    } else if (event.target.classList.contains("decrease-quantity")) {
        decreaseQuantity(name);
    } else if (event.target.classList.contains("remove-cell-car")) {
        removeItemCart(name);
    }
});

address.addEventListener("input",function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){ //Se por acaso a pessoa digitar depois que aparecer a mensagem de erro de endereço, a mensagem de endereço some e a borda volta ao normal
        address_warn.style.visibility = 'hidden'; 
        address.style.border = '1px solid grey'
    }
})


checkout_btn.addEventListener("click",function(){

   if(lista.length === 0)return; //Se a lista tiver igual a zero não quero fazer nada
   if(address.value === ""){ //Mas se clicar no botao de finalizar e o endereço tiver vazio, mostra o aviso
        address_warn.style.visibility = 'visible';
        address.style.border = '2px solid red';
        return;
   }

   //Enviar os itens para o whatsapp
   const cart_items = lista.map((item) =>{
    return(
        ` ${item.name} Quantidade: (${item.quantity}) Preço:R$ (${item.price}) /`
    )
   }).join("") //devolve em texto

   const message = encodeURIComponent(cart_items)
   const phone = "5583986517099"

   window.open(`https://wa.me/${phone}?text=${message} Endereço: ${address.value}`)

lista = [];
updatecarrinho(); //pra zerar e a
})