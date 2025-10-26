const API_URL = 'https://deisishop.pythonanywhere.com';
let produtos = [];
let categorias = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAPI();
    atualizarCesto();
    
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProdutos);
    document.getElementById('ordenar').addEventListener('change', filtrarProdutos);
    document.getElementById('procurar').addEventListener('input', filtrarProdutos);
    document.getElementById('btn-comprar').addEventListener('click', realizarCompra);
});

async function carregarDadosAPI() {
    try {
        const responseProdutos = await fetch(`${API_URL}/products`);
        produtos = await responseProdutos.json();
        
        const responseCategorias = await fetch(`${API_URL}/categories`);
        categorias = await responseCategorias.json();
        
        preencherCategorias();
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function preencherCategorias() {
    const select = document.getElementById('filtro-categoria');
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        select.appendChild(option);
    });
}

function filtrarProdutos() {
    const categoriaFiltro = document.getElementById('filtro-categoria').value;
    const ordenacao = document.getElementById('ordenar').value;
    const termoPesquisa = document.getElementById('procurar').value.toLowerCase();
    
    let produtosFiltrados = [...produtos];
    
    if (categoriaFiltro) {
        produtosFiltrados = produtosFiltrados.filter(p => p.category === categoriaFiltro);
    }
    
    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.title.toLowerCase().includes(termoPesquisa) ||
            p.description.toLowerCase().includes(termoPesquisa)
        );
    }
    
    if (ordenacao === 'crescente') {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (ordenacao === 'decrescente') {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }
    
    exibirProdutos(produtosFiltrados);
}

function exibirProdutos(listaProdutos) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';
    
    listaProdutos.forEach(produto => {
        const artigo = criarProduto(produto);
        container.appendChild(artigo);
    });
}

function criarProduto(produto) {
    const article = document.createElement('article');
    
    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;
    
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const preco = document.createElement('p');
    preco.className = 'price';
    preco.textContent = `${produto.price.toFixed(2)} €`;
    
    const botao = document.createElement('button');
    botao.textContent = '+ Adicionar ao Cesto';
    botao.addEventListener('click', () => adicionarAoCesto(produto));
    
    article.append(titulo, imagem, preco, botao);
    
    return article;
}

function adicionarAoCesto(produto) {
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    cesto.push(produto);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
}

function atualizarCesto() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const container = document.getElementById('produtos-selecionados');
    const custoTotalElement = document.getElementById('custo-total');
    
    container.innerHTML = '';
    
    let custoTotal = 0;
    
    cesto.forEach((produto, index) => {
        const article = criarProdutoCesto(produto, index);
        container.appendChild(article);
        custoTotal += produto.price;
    });
    
    custoTotalElement.textContent = custoTotal.toFixed(2);
}

function criarProdutoCesto(produto, index) {
    const article = document.createElement('article');
    
    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;
    
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const preco = document.createElement('p');
    preco.className = 'price';
    preco.textContent = `${produto.price.toFixed(2)} €`;
    
    const botao = document.createElement('button');
    botao.textContent = '- Remover do Cesto';
    botao.addEventListener('click', () => removerDoCesto(index));
    
    article.append(titulo, imagem, preco, botao);
    
    return article;
}

function removerDoCesto(index) {
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    cesto.splice(index, 1);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
}

async function realizarCompra() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    const estudante = document.getElementById('estudante-checkbox').checked;
    const cupao = document.getElementById('cupao-desconto').value.trim();
    
    const produtos_ids = cesto.map(p => p.id);
    
    const dados = {
        products: produtos_ids
    };
    
    if (estudante) {
        dados.student = true;
    }
    
    if (cupao) {
        dados.coupon = cupao;
    }
    
    try {
        const response = await fetch(`${API_URL}/buy/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            const valorFinal = resultado.totalCost || resultado.total_cost;
            const referencia = resultado.reference;
            
            alert(`Compra realizada com sucesso!\nReferência: ${referencia}\nValor Final: ${valorFinal.toFixed(2)} €`);
            
            localStorage.removeItem('cesto');
            atualizarCesto();
            document.getElementById('estudante-checkbox').checked = false;
            document.getElementById('cupao-desconto').value = '';
        } else {
            alert(`Erro na compra: ${resultado.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao realizar compra:', error);
        alert('Erro ao processar a compra. Tente novamente.');
    }
}