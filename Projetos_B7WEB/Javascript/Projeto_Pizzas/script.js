let cart = [];
let modalQt = 1;
let modalKey = 0;

//Duas funções que basicamente irão selecionar um elemento no HTML código ficar mais limpo
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
//Listagem das Pizzas
pizzaJson.map((item, index) => {
    //Com o cloneNode(true) ele irá clonar com todos os elementos dentro, e por re
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //Adicionando a posição do array da API para conseguir selecionar uma pizza específica
    pizzaItem.setAttribute('data-key', index);
    //Preenchendo as informações de Pizza item
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        //Função utilizada para evitar que o link recarregue a página quando clicado
        e.preventDefault();
        //Utilizando a função closest, ele irá pegar elemento mais próximo que eu setar o nome 
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src=pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML =`R$ ${pizzaJson[key].price.toFixed(2)}`;

        //Função para retirar o selected de um tamanho de pizza
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //Nessa função será utilizado o forEach para verificar o tamanho dos elementos que existem no pizzaInfo-size
        //Utilizando a variável size e size index, sendo size o valor e o size index o índice onde esse valor foi alocado
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //If para que quando o usuário abra o MODAL, a pizza grande fique selecionada por padrão
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        //Função para que ao clicar na pizza tenha uma animação de fade ao abrir
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1}, 100);
    });

    c('.pizza-area').append(pizzaItem)
});

//Eventos do MODAL
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500);
}
//Fechando o MODAL, como o cs irá trazer um array, será necessário usar o forEach
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
})

//Botão de menos e mais no MODAL
c('.pizzaInfo--qtmenos').addEventListener('click',() =>{
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click',() =>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//Botão de tamanho de pizza sendo funcional, removendo qualquer selected que tenha e adicionando o selected no elemento clicado
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});


//Botão de adicionar no carrinho
c('.pizzaInfo--addButton').addEventListener('click',()=>{
    //Qual a pizza? Criando a variável modalKey e fazendo ela receber a variável key
    //Qual o tamanho? Os tamanhos possuem o data-key, utilizando eles será possível saber qual o tamanho
    //let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
    //Quantas pizzas? O modalQt é isso
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id +'@'+size;
    let key = cart.findIndex((item) =>item.identifier == identifier);
    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size:size,
            qt: modalQt
    });
    }
    updateCart();
    closeModal();
})

c('.menu-openner').addEventListener('click',() => {
    if (cart.length > 0){
        c('aside').style.left = '0';
    }
})

c('.menu-closer').addEventListener('click',() => {
    c('aside').style.left = '100vw';
})
//Função para atualizar o carrinho
function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    //IF para verificar se existe item dentro do array cart, não existindo removendo a class show onde retorna o menu
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let total = 0;

        //For para que o pizzaItem receba o valor que estará dentro do pizzaJson
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);
            //Switch utilizando o valor do index do tamanho de pizza, para alterar o pizzaSizeName entrem P,M ou G
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            //Quantidade no carrinho
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        discount = subtotal * 0.1;
        total = subtotal - discount;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}