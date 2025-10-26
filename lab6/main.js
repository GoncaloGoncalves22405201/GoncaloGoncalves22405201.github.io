document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(produtos);
    atualizarCesto();
});

function carregarProdutos(produtos) {
    const listaProdutos = document.querySelector('#lista-produtos');
    
    produtos.forEach(produto => {
        const artigo = criarProduto(produto);
        listaProdutos.append(artigo);
    });
}

function criarProduto(produto) {
    const article = document.createElement('article');
    
    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;
    
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const descricao = document.createElement('p');
    descricao.textContent = produto.description;
    
    const preco = document.createElement('p');
    preco.className = 'price';
    preco.textContent = `Custo total: ${produto.price.toFixed(2)} €`;
    
    const botao = document.createElement('button');
    botao.textContent = '+ Adicionar ao Cesto';
    
    botao.addEventListener('click', () => {
        adicionarAoCesto(produto);
    });
    
    article.append(titulo, imagem, descricao, preco, botao);
    
    return article;
}

function adicionarAoCesto(produto) {
    let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    
    produtosSelecionados.push(produto);
    
    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    
    atualizarCesto();
}

function atualizarCesto() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const containerCesto = document.querySelector('#produtos-selecionados');
    const custoTotalElement = document.querySelector('#custo-total');
    
    containerCesto.innerHTML = '';
    
    let custoTotal = 0;
    
    produtosSelecionados.forEach(produto => {
        const article = criarProdutoCesto(produto);
        containerCesto.append(article);
        custoTotal += produto.price;
    });
    
    custoTotalElement.textContent = custoTotal.toFixed(2);
}

function criarProdutoCesto(produto) {
    const article = document.createElement('article');
    
    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;
    
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const preco = document.createElement('p');
    preco.className = 'price';
    preco.textContent = `Custo total: ${produto.price.toFixed(2)} €`;
    
    const botao = document.createElement('button');
    botao.textContent = '- Remover do Cesto';
    
    botao.addEventListener('click', () => {
        removerDoCesto(produto);
    });
    
    article.append(titulo, imagem, preco, botao);
    
    return article;
}

function removerDoCesto(produto) {
    let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    
    const index = produtosSelecionados.findIndex(p => p.id === produto.id);
    
    if (index !== -1) {
        produtosSelecionados.splice(index, 1);
    }
    
    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    
    atualizarCesto();
}