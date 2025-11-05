const API_URL = 'https://deisishop.pythonanywhere.com';
let produtos = [];
let categorias = [];
let referenciaAtual = 2011240049; 

// =================================
// A. INICIALIZAÇÃO DA APLICAÇÃO
// =================================
// DOMContentLoaded: Evento disparado quando o DOM está completamente construído
// Permite colocar script no <head> sem problemas
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAPI();
    atualizarCesto();
    
    // C. EVENT LISTENERS - addEventListener: Associa eventos a elementos
    // Forma moderna e recomendada, permite múltiplos handlers para o mesmo evento
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProdutos);
    document.getElementById('ordenar').addEventListener('change', filtrarProdutos);
    document.getElementById('procurar').addEventListener('input', filtrarProdutos);
    document.getElementById('btn-comprar').addEventListener('click', realizarCompra);
    document.getElementById('estudante-checkbox').addEventListener('change', calcularValorFinal);
    document.getElementById('cupao-desconto').addEventListener('input', calcularValorFinal);
});

// =================================
// B. FETCH DE DADOS - Pedidos assíncronos à API
// =================================
// fetch(url): Faz pedidos HTTP e retorna Promise
// async/await: Forma moderna de lidar com código assíncrono
// .then() processa a resposta quando chega
async function carregarDadosAPI() {
    try {
        // Fetch GET para obter produtos da API
        const responseProdutos = await fetch(`${API_URL}/products`);
        // response.json(): Converte resposta em objeto JavaScript
        produtos = await responseProdutos.json();
        
        // Fetch GET para obter categorias da API
        const responseCategorias = await fetch(`${API_URL}/categories`);
        categorias = await responseCategorias.json();
        
        preencherCategorias();
        exibirProdutos(produtos);
    } catch (error) {
        // catch: Trata erros de fetch
        console.error('Erro ao carregar dados:', error);
    }
    
    // MODIFICAÇÃO 1: Ordenar produtos por preço ao carregar
    // O que faz: Ordena automaticamente produtos do mais barato ao mais caro
    // Como fazer: Adicionar após produtos = await responseProdutos.json();
    /*
    produtos.sort(function(a, b) {
        return a.price - b.price;
    });
    */
}

// =================================
// C. FUNÇÕES AUXILIARES - Manipulação do DOM
// =================================
function preencherCategorias() {
    // A. Variáveis - document.querySelector/getElementById: Seleciona elementos do DOM
    const select = document.getElementById('filtro-categoria');
    
    // array.forEach(callback): Percorre array executando função para cada elemento
    // Arrow function (categoria => {...}): Forma abreviada de função anónima
    categorias.forEach(categoria => {
        // document.createElement(tag): Cria novo elemento HTML
        const option = document.createElement('option');
        
        // element.value e element.textContent: Define atributos e conteúdo do elemento
        option.value = categoria;
        option.textContent = categoria;
        
        // node.appendChild(novoNode): Adiciona elemento ao DOM
        select.appendChild(option);
    });
    
    // MODIFICAÇÃO 2: Ordenar categorias alfabeticamente no select
    // O que faz: Mostra categorias em ordem alfabética
    // Como fazer: Adicionar antes do forEach
    /*
    categorias.sort();
    */
}

function filtrarProdutos() {
    // A. Variáveis - Obter valores dos inputs
    // element.value: Obtém valor de input
    const categoriaFiltro = document.getElementById('filtro-categoria').value;
    const ordenacao = document.getElementById('ordenar').value;
    // .toLowerCase(): Converte para minúsculas para comparação case-insensitive
    const termoPesquisa = document.getElementById('procurar').value.toLowerCase();
    
    // Spread operator [...lista]: Cria cópia do array (não modifica original)
    let produtosFiltrados = [...produtos];
    
    // array.filter(callback): Cria novo array com elementos que satisfazem condição
    // Retorna true para manter elemento, false para remover
    if (categoriaFiltro) {
        produtosFiltrados = produtosFiltrados.filter(p => p.category === categoriaFiltro);
    }
    
    // .includes(): Verifica se string contém outra string
    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.title.toLowerCase().includes(termoPesquisa) ||
            p.description.toLowerCase().includes(termoPesquisa)
        );
    }
    
    // array.sort(callback): Ordena elementos do array (modifica-o)
    // (a, b) => a - b: ordem crescente (negativo = a antes de b)
    // (a, b) => b - a: ordem decrescente (positivo = b antes de a)
    if (ordenacao === 'crescente') {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (ordenacao === 'decrescente') {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }
    
    exibirProdutos(produtosFiltrados);
    
    // MODIFICAÇÃO 3: Filtrar por intervalo de preços
    // O que faz: Filtra produtos entre preço mínimo e máximo
    // Passo 1: Adicionar inputs no HTML (secção filtros):
    // <input type="number" id="preco-min" placeholder="Preço mínimo">
    // <input type="number" id="preco-max" placeholder="Preço máximo">
    // Passo 2: Adicionar antes do exibirProdutos():
    /*
    const precoMin = parseFloat(document.getElementById('preco-min').value) || 0;
    const precoMax = parseFloat(document.getElementById('preco-max').value) || 999999;
    
    produtosFiltrados = produtosFiltrados.filter(function(p) {
        return p.price >= precoMin && p.price <= precoMax;
    });
    */
    // Passo 3: Adicionar event listeners no DOMContentLoaded:
    /*
    document.getElementById('preco-min').addEventListener('input', filtrarProdutos);
    document.getElementById('preco-max').addEventListener('input', filtrarProdutos);
    */
    
    // MODIFICAÇÃO 4: Ordenar por avaliação (rating)
    // O que faz: Ordena produtos pela melhor avaliação
    // Passo 1: Adicionar option no HTML (select ordenar):
    // <option value="rating">Melhor Avaliação</option>
    // Passo 2: Adicionar após outras ordenações:
    /*
    else if (ordenacao === 'rating') {
        produtosFiltrados.sort(function(a, b) {
            return b.rating.rate - a.rating.rate;
        });
    }
    */
    
    // MODIFICAÇÃO 5: Botão para limpar filtros
    // O que faz: Remove todos os filtros aplicados
    // Passo 1: Adicionar botão no HTML:
    // <button id="limpar-filtros">Limpar Filtros</button>
    // Passo 2: Criar função:
    /*
    function limparFiltros() {
        document.getElementById('filtro-categoria').value = '';
        document.getElementById('ordenar').value = '';
        document.getElementById('procurar').value = '';
        exibirProdutos(produtos);
    }
    */
    // Passo 3: Adicionar event listener no DOMContentLoaded:
    /*
    document.getElementById('limpar-filtros').addEventListener('click', limparFiltros);
    */
}

function exibirProdutos(listaProdutos) {
    // A. Variáveis - Seleção de elemento container
    const container = document.getElementById('lista-produtos');
    
    // element.innerHTML = '': Limpa todo conteúdo HTML do elemento
    container.innerHTML = '';
    
    // Verificar se há produtos para mostrar
    if (listaProdutos.length === 0) {
        container.innerHTML = '<p class="sem-produtos">Nenhum produto encontrado.</p>';
        return;
    }
    
    // array.forEach(produto => {...}): Percorre lista e executa função para cada produto
    listaProdutos.forEach(produto => {
        const artigo = criarProduto(produto);
        // node.appendChild(novoNode): Adiciona elemento ao container
        container.appendChild(artigo);
    });
    
    // MODIFICAÇÃO 6: Mostrar descrição do produto
    // O que faz: Adiciona descrição limitada abaixo do preço
    // No criarProduto(), adicionar após criar preco:
    /*
    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = produto.description.substring(0, 100) + '...';
    descricao.style.fontSize = '0.9rem';
    descricao.style.color = '#666';
    
    article.append(titulo, imagem, preco, descricao, botao);
    */
    
    // MODIFICAÇÃO 7: Mostrar avaliação (rating) com estrelas
    // O que faz: Exibe avaliação e número de reviews
    // No criarProduto(), adicionar após criar preco:
    /*
    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `${produto.rating.rate} ★ (${produto.rating.count} avaliações)`;
    rating.style.color = '#f39c12';
    rating.style.fontWeight = 'bold';
    
    article.append(titulo, imagem, preco, rating, botao);
    */
}

function criarProduto(produto) {
    // document.createElement(tag): Cria elementos HTML dinamicamente
    const article = document.createElement('article');
    
    const titulo = document.createElement('h3');
    // element.textContent: Define texto do elemento (seguro, não interpreta HTML)
    titulo.textContent = produto.title;
    
    const imagem = document.createElement('img');
    // element.src e element.alt: Define atributos da imagem
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const preco = document.createElement('p');
    // element.className: Define classe CSS do elemento
    preco.className = 'price';
    // Template string `${variavel}`: Interpola variáveis em strings
    // .toFixed(2): Formata número com 2 casas decimais
    preco.textContent = `${produto.price.toFixed(2)} €`;
    
    const botao = document.createElement('button');
    botao.textContent = '+ Adicionar ao Cesto';
    // element.addEventListener(evento, handler): Associa evento ao elemento
    // Arrow function () => {...}: Função anónima que mantém contexto
    botao.addEventListener('click', () => adicionarAoCesto(produto));
    
    // node.append(...nodes): Adiciona múltiplos elementos de uma vez
    article.append(titulo, imagem, preco, botao);
    
    return article;
    
    // MODIFICAÇÃO 8: Botão para ver/ocultar descrição completa
    // O que faz: Toggle para mostrar descrição completa do produto
    // Adicionar antes do return:
    /*
    const descricaoCompleta = document.createElement('p');
    descricaoCompleta.textContent = produto.description;
    descricaoCompleta.style.display = 'none';
    descricaoCompleta.className = 'descricao-completa';
    
    const btnDetalhes = document.createElement('button');
    btnDetalhes.textContent = 'Ver Detalhes';
    btnDetalhes.style.marginTop = '10px';
    
    btnDetalhes.onclick = function() {
        if (descricaoCompleta.style.display === 'none') {
            descricaoCompleta.style.display = 'block';
            btnDetalhes.textContent = 'Ocultar Detalhes';
        } else {
            descricaoCompleta.style.display = 'none';
            btnDetalhes.textContent = 'Ver Detalhes';
        }
    };
    
    article.append(titulo, imagem, preco, botao, btnDetalhes, descricaoCompleta);
    */
    
    // MODIFICAÇÃO 9: Destacar termo pesquisado no título
    // O que faz: Marca termo pesquisado com fundo amarelo
    // Substituir titulo.textContent = produto.title; por:
    /*
    const termoPesquisa = document.getElementById('procurar').value;
    if (termoPesquisa) {
        const regex = new RegExp('(' + termoPesquisa + ')', 'gi');
        const partes = produto.title.split(regex);
        
        titulo.innerHTML = '';
        partes.forEach(function(parte) {
            if (parte.toLowerCase() === termoPesquisa.toLowerCase()) {
                const mark = document.createElement('mark');
                mark.textContent = parte;
                mark.style.backgroundColor = 'yellow';
                titulo.append(mark);
            } else {
                const span = document.createElement('span');
                span.textContent = parte;
                titulo.append(span);
            }
        });
    } else {
        titulo.textContent = produto.title;
    }
    */
}

// =================================
// D. GESTÃO DO CESTO DE COMPRAS
// =================================
// localStorage: Armazena dados que persistem após fechar browser
// JSON.parse/stringify: Converte entre objeto e string JSON
function adicionarAoCesto(produto) {
    // Obter cesto atual do localStorage
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    // array.push(elemento): Adiciona elemento ao fim do array
    cesto.push(produto);
    // Guardar cesto atualizado
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
    
    // MODIFICAÇÃO 10: Notificação ao adicionar produto
    // O que faz: Mostra mensagem confirmando adição
    // Opção 1 - Alert simples (adicionar após atualizarCesto()):
    /*
    alert(`${produto.title} foi adicionado ao cesto!`);
    */
    
    // Opção 2 - Notificação elegante com timeout:
    /*
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.textContent = `✓ ${produto.title} adicionado ao cesto!`;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = '#27ae60';
    notif.style.color = 'white';
    notif.style.padding = '15px 20px';
    notif.style.borderRadius = '5px';
    notif.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notif.style.zIndex = '1000';
    
    document.body.append(notif);
    
    setTimeout(function() {
        notif.remove();
    }, 2000);
    */
    
    // MODIFICAÇÃO 11: Impedir adicionar produto duplicado
    // O que faz: Verifica se produto já existe no cesto
    // Substituir todo o código da função por:
    /*
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    
    let jaExiste = false;
    cesto.forEach(function(item) {
        if (item.id === produto.id) {
            jaExiste = true;
        }
    });
    
    if (jaExiste) {
        alert(`${produto.title} já está no cesto!`);
        return;
    }
    
    cesto.push(produto);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
    */
}

function atualizarCesto() {
    // Obter cesto do localStorage
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const container = document.getElementById('produtos-selecionados');
    const custoTotalElement = document.getElementById('custo-total');
    
    // Limpar container
    container.innerHTML = '';
    
    let custoTotal = 0;
    
    // array.forEach((elemento, índice) => {...}): forEach com índice
    cesto.forEach((produto, index) => {
        const article = criarProdutoCesto(produto, index);
        container.appendChild(article);
        // Acumular custo total
        custoTotal += produto.price;
    });
    
    // Atualizar custo total no DOM
    custoTotalElement.textContent = custoTotal.toFixed(2);
    calcularValorFinal();
    
    // MODIFICAÇÃO 12: Mostrar contador de produtos no cesto
    // O que faz: Exibe quantos produtos estão no cesto
    // Adicionar no final da função:
    /*
    if (!document.getElementById('contador-cesto')) {
        const contador = document.createElement('p');
        contador.id = 'contador-cesto';
        contador.style.fontWeight = 'bold';
        contador.style.marginTop = '15px';
        contador.style.fontSize = '1.1rem';
        document.getElementById('cesto').append(contador);
    }
    
    const textoContador = cesto.length === 1 ? '1 produto' : `${cesto.length} produtos`;
    document.getElementById('contador-cesto').textContent = `Total: ${textoContador}`;
    */
    
    // MODIFICAÇÃO 13: Agrupar produtos repetidos com quantidade
    // O que faz: Conta produtos iguais e mostra quantidade
    // Substituir o forEach acima por:
    /*
    const produtosAgrupados = {};
    
    cesto.forEach(function(produto) {
        if (produtosAgrupados[produto.id]) {
            produtosAgrupados[produto.id].quantidade++;
        } else {
            produtosAgrupados[produto.id] = {
                id: produto.id,
                title: produto.title,
                image: produto.image,
                price: produto.price,
                quantidade: 1,
                produtoOriginal: produto
            };
        }
    });
    
    for (let id in produtosAgrupados) {
        const item = produtosAgrupados[id];
        const article = document.createElement('article');
        
        const titulo = document.createElement('h3');
        titulo.textContent = `${item.title} ${item.quantidade > 1 ? '(x' + item.quantidade + ')' : ''}`;
        
        const imagem = document.createElement('img');
        imagem.src = item.image;
        imagem.alt = item.title;
        
        const preco = document.createElement('p');
        preco.className = 'price';
        const precoTotal = item.price * item.quantidade;
        preco.textContent = `${precoTotal.toFixed(2)} €`;
        
        const botao = document.createElement('button');
        botao.textContent = '- Remover';
        botao.addEventListener('click', function() {
            let indexRemover = -1;
            for (let i = 0; i < cesto.length; i++) {
                if (cesto[i].id === item.id) {
                    indexRemover = i;
                    break;
                }
            }
            if (indexRemover !== -1) {
                removerDoCesto(indexRemover);
            }
        });
        
        article.append(titulo, imagem, preco, botao);
        container.append(article);
        
        custoTotal += precoTotal;
    }
    */
    
    // MODIFICAÇÃO 14: Botão para limpar todo o cesto
    // O que faz: Remove todos os produtos de uma vez
    // Passo 1: Adicionar botão no HTML (secção cesto):
    // <button id="btn-limpar-cesto">Limpar Cesto</button>
    // Passo 2: Criar função:
    /*
    function limparCesto() {
        const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
        if (cesto.length === 0) {
            alert('O cesto já está vazio!');
            return;
        }
        
        const confirmar = confirm('Deseja remover todos os produtos do cesto?');
        if (confirmar) {
            localStorage.removeItem('cesto');
            atualizarCesto();
        }
    }
    */
    // Passo 3: Adicionar event listener no DOMContentLoaded:
    /*
    document.getElementById('btn-limpar-cesto').addEventListener('click', limparCesto);
    */
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
    // element.addEventListener com arrow function mantém contexto
    botao.addEventListener('click', () => removerDoCesto(index));
    
    article.append(titulo, imagem, preco, botao);
    
    return article;
}

function removerDoCesto(index) {
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    // array.splice(índice, quantidade): Remove elementos do array
    // splice modifica o array original
    cesto.splice(index, 1);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
    
    // MODIFICAÇÃO 15: Confirmação ao remover produto
    // O que faz: Pede confirmação antes de remover
    // Adicionar no início da função:
    /*
    const produto = cesto[index];
    const confirmar = confirm(`Deseja remover ${produto.title} do cesto?`);
    if (!confirmar) {
        return;
    }
    */
}

// =================================
// E. CÁLCULO DE PREÇOS E DESCONTOS
// =================================
function calcularValorFinal() {
    // parseFloat: Converte string em número decimal
    const custoTotalElement = document.getElementById('custo-total');
    const custoTotal = parseFloat(custoTotalElement.textContent);
    
    // element.checked: Verifica se checkbox está marcado
    const estudante = document.getElementById('estudante-checkbox').checked;
    // element.value.trim(): Obtém valor e remove espaços
    const cupao = document.getElementById('cupao-desconto').value.trim();
    
    let valorFinal = custoTotal;
    let descontoAplicado = 0;
    
    // Calcular descontos acumulados
    if (estudante) {
        descontoAplicado += 0.25; // 25%
    }
    
    if (cupao) {
        descontoAplicado += 0.25; // 25%
    }
    
    valorFinal = custoTotal * (1 - descontoAplicado);
    
    // Criar ou atualizar elemento de valor final
    let valorFinalElement = document.getElementById('valor-final');
    let referenciaElement = document.getElementById('referencia-preview');
    
    // document.getElementById retorna null se elemento não existe
    if (!valorFinalElement) {
        valorFinalElement = document.createElement('p');
        valorFinalElement.id = 'valor-final';
        // element.style.propriedade: Modifica CSS inline
        valorFinalElement.style.fontSize = '1.3rem';
        valorFinalElement.style.fontWeight = 'bold';
        valorFinalElement.style.marginTop = '20px';
        
        const checkout = document.getElementById('checkout');
        // node.insertBefore(novo, referência): Insere elemento antes de outro
        checkout.parentNode.insertBefore(valorFinalElement, checkout.nextSibling);
    }
    
    if (!referenciaElement) {
        referenciaElement = document.createElement('p');
        referenciaElement.id = 'referencia-preview';
        referenciaElement.style.fontSize = '1.1rem';
        referenciaElement.style.marginTop = '10px';
        
        valorFinalElement.parentNode.insertBefore(referenciaElement, valorFinalElement.nextSibling);
    }
    
    // Mostrar valores apenas se houver produtos no cesto
    if (custoTotal > 0) {
        valorFinalElement.textContent = `Valor final a pagar (com eventuais descontos): ${valorFinal.toFixed(2)} €`;
        
        const referenciaFormatada = formatarReferencia(referenciaAtual);
        referenciaElement.textContent = `Referência de pagamento: ${referenciaFormatada} €`;
    } else {
        valorFinalElement.textContent = '';
        referenciaElement.textContent = '';
    }
    
    // MODIFICAÇÃO 16: Mostrar detalhes dos descontos aplicados
    // O que faz: Exibe breakdown dos descontos
    // Adicionar no final da função:
    /*
    if (!document.getElementById('detalhes-desconto')) {
        const detalhes = document.createElement('p');
        detalhes.id = 'detalhes-desconto';
        detalhes.style.marginTop = '10px';
        detalhes.style.fontSize = '0.95rem';
        detalhes.style.color = '#27ae60';
        document.getElementById('checkout').append(detalhes);
    }
    
    let textoDesconto = '';
    if (descontoAplicado > 0) {
        textoDesconto = 'Descontos aplicados: ';
        const descontosLista = [];
        
        if (estudante) {
            descontosLista.push('25% (Estudante)');
        }
        if (cupao) {
            descontosLista.push('25% (Cupão)');
        }
        
        textoDesconto += descontosLista.join(' + ');
        textoDesconto += ` = ${(descontoAplicado * 100).toFixed(0)}% total`;
        textoDesconto += ` | Poupança: ${(custoTotal * descontoAplicado).toFixed(2)} €`;
    }
    
    document.getElementById('detalhes-desconto').textContent = textoDesconto;
    */
    
    // MODIFICAÇÃO 17: Validar cupões específicos
    // O que faz: Só aceita cupões de uma lista predefinida
    // Substituir a verificação do cupão (if (cupao)) por:
    /*
    const cupao = document.getElementById('cupao-desconto').value.trim().toUpperCase();
    const cupoesValidos = ['DESCONTO2024', 'PROMO50', 'BEMVINDO', 'NATAL2024'];
    
    let cupaoValido = false;
    cupoesValidos.forEach(function(c) {
        if (c === cupao) {
            cupaoValido = true;
        }
    });
    
    if (cupaoValido) {
        descontoAplicado += 0.25;
    } else if (cupao) {
        alert('Cupão inválido! Cupões válidos: ' + cupoesValidos.join(', '));
        document.getElementById('cupao-desconto').value = '';
    }
    */
    
    // MODIFICAÇÃO 18: Desconto progressivo por valor de compra
    // O que faz: Aplica descontos automáticos baseados no total
    // Adicionar após calcular descontoAplicado:
    /*
    let descontoProgressivo = 0;
    if (custoTotal >= 100) {
        descontoProgressivo = 0.15; // 15% para compras >= 100€
    } else if (custoTotal >= 50) {
        descontoProgressivo = 0.10; // 10% para compras >= 50€
    } else if (custoTotal >= 30) {
        descontoProgressivo = 0.05; // 5% para compras >= 30€
    }
    
    descontoAplicado += descontoProgressivo;
    
    if (descontoProgressivo > 0) {
        if (!document.getElementById('desconto-progressivo')) {
            const msgDesconto = document.createElement('p');
            msgDesconto.id = 'desconto-progressivo';
            msgDesconto.style.color = '#e74c3c';
            msgDesconto.style.fontWeight = 'bold';
            document.getElementById('checkout').append(msgDesconto);
        }
        document.getElementById('desconto-progressivo').textContent = 
            `Desconto por valor de compra: ${(descontoProgressivo * 100).toFixed(0)}%`;
    }
    */
}

// string.slice(): Extrai parte de uma string
function formatarReferencia(numero) {
    const str = numero.toString();
    // .slice(início, fim): Corta string
    return str.slice(0, 6) + '-' + str.slice(6);
}

// =================================
// F. FINALIZAÇÃO DE COMPRA
// =================================
// fetch POST: Envia dados ao servidor
// JSON.stringify: Converte objeto JavaScript em string JSON
async function realizarCompra() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    
    // Validação: cesto vazio
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    // Incrementar referência para próxima compra
    referenciaAtual++;
    calcularValorFinal(); 
    
    const estudante = document.getElementById('estudante-checkbox').checked;
    const cupao = document.getElementById('cupao-desconto').value.trim();
    
    // array.map(callback): Cria novo array transformando cada elemento
    const produtos_ids = cesto.map(p => p.id);
    
    // Construir objeto de dados para enviar
    const dados = {
        products: produtos_ids
    };
    
    // Adicionar propriedades condicionalmente
    if (estudante) {
        dados.student = true;
    }
    
    if (cupao) {
        dados.coupon = cupao;
    }
    
    try {
        // fetch POST: Envia pedido HTTP com método POST
        // headers: Define tipo de conteúdo (JSON)
        // body: Dados a enviar (convertidos para string JSON)
        const response = await fetch(`${API_URL}/buy/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        // Converter resposta em objeto JavaScript
        const resultado = await response.json();
        
        // response.ok: true se status 200-299
        if (response.ok) {
            // Obter valor final da resposta (API pode usar nomes diferentes)
            const valorFinal = resultado.totalCost || resultado.total_cost;
            const referenciaFormatada = formatarReferencia(referenciaAtual - 1); 
            
            // alert(): Mostra janela de diálogo ao utilizador
            alert(`Compra realizada com sucesso!\nReferência: ${referenciaFormatada}\nValor Final: ${valorFinal.toFixed(2)} €`);
            
            // localStorage.removeItem: Remove item do armazenamento local
            localStorage.removeItem('cesto');
            atualizarCesto();
            // Limpar campos do formulário
            document.getElementById('estudante-checkbox').checked = false;
            document.getElementById('cupao-desconto').value = '';
        }
    } catch (error) {
        // catch: Captura erros de rede ou de servidor
        console.error('Erro ao realizar compra:', error);
    }
    
    // MODIFICAÇÃO 19: Pedir confirmação antes de finalizar compra
    // O que faz: Mostra resumo e pede confirmação
    // Adicionar no início da função, após validação do cesto vazio:
    /*
    const totalProdutos = cesto.length;
    const valorTotal = parseFloat(document.getElementById('custo-total').textContent);
    
    const confirmar = confirm(
        `Confirmar compra?\n\n` +
        `Produtos: ${totalProdutos}\n` +
        `Valor total: ${valorTotal.toFixed(2)} €\n\n` +
        `Clique OK para continuar`
    );
    
    if (!confirmar) {
        return;
    }
    */
    
    // MODIFICAÇÃO 20: Guardar histórico de compras no localStorage
    // O que faz: Armazena todas as compras realizadas
    // Substituir o bloco if (response.ok) por:
    /*
    if (response.ok) {
        const valorFinal = resultado.totalCost || resultado.total_cost;
        const referenciaFormatada = formatarReferencia(referenciaAtual - 1);
        
        // Obter ou criar histórico
        let historico = JSON.parse(localStorage.getItem('historico-compras'));
        if (!historico) {
            historico = [];
        }
        
        // Adicionar compra ao histórico
        historico.push({
            data: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),
            referencia: referenciaFormatada,
            valorFinal: valorFinal,
            produtos: cesto,
            totalProdutos: cesto.length
        });
        
        // Guardar histórico atualizado
        localStorage.setItem('historico-compras', JSON.stringify(historico));
        
        alert(`Compra realizada com sucesso!\nReferência: ${referenciaFormatada}\nValor Final: ${valorFinal.toFixed(2)} €`);
        
        localStorage.removeItem('cesto');
        atualizarCesto();
        document.getElementById('estudante-checkbox').checked = false;
        document.getElementById('cupao-desconto').value = '';
    }
    */
    
    // MODIFICAÇÃO 21: Validar campos antes de comprar
    // O que faz: Verifica se estudante ou cupão estão preenchidos corretamente
    // Adicionar após obter valores estudante e cupao:
    /*
    if (estudante && cupao) {
        const confirmar = confirm(
            'Tem desconto de estudante E cupão aplicados (50% desconto total).\n' +
            'Confirma que ambos são válidos?'
        );
        if (!confirmar) {
            return;
        }
    }
    
    if (cupao) {
        const cupoesValidos = ['DESCONTO2024', 'PROMO50', 'BEMVINDO'];
        let cupaoValido = false;
        
        cupoesValidos.forEach(function(c) {
            if (c === cupao.toUpperCase()) {
                cupaoValido = true;
            }
        });
        
        if (!cupaoValido) {
            alert('Cupão inválido! A compra não pode ser finalizada.');
            return;
        }
    }
    */
    
    // MODIFICAÇÃO 22: Mensagem de erro personalizada
    // O que faz: Mostra mensagem específica baseada no erro
    // Substituir o bloco catch por:
    /*
    catch (error) {
        console.error('Erro ao realizar compra:', error);
        
        let mensagemErro = 'Erro ao processar a compra. ';
        
        if (error.message.includes('Failed to fetch')) {
            mensagemErro += 'Verifique sua conexão com a internet.';
        } else if (error.message.includes('timeout')) {
            mensagemErro += 'O servidor demorou muito a responder. Tente novamente.';
        } else {
            mensagemErro += 'Tente novamente mais tarde.';
        }
        
        alert(mensagemErro);
    }
    */
}

// MODIFICAÇÃO 23: Função para mostrar histórico de compras
// O que faz: Cria interface para visualizar todas as compras
// Passo 1: Adicionar secção no HTML:
// <section id="historico">
//   <h2>Histórico de Compras</h2>
//   <button id="btn-ver-historico">Ver Histórico</button>
//   <button id="btn-limpar-historico">Limpar Histórico</button>
//   <div id="lista-historico"></div>
// </section>
// Passo 2: Adicionar função:
/*
function mostrarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico-compras'));
    const container = document.getElementById('lista-historico');
    container.innerHTML = '';
    
    if (!historico || historico.length === 0) {
        container.innerHTML = '<p class="sem-historico">Nenhuma compra realizada ainda.</p>';
        return;
    }
    
    // array.reverse(): Inverte ordem (mais recentes primeiro)
    historico.reverse();
    
    historico.forEach(function(compra, index) {
        const div = document.createElement('div');
        div.className = 'item-historico';
        div.style.border = '2px solid #3498db';
        div.style.padding = '15px';
        div.style.marginBottom = '15px';
        div.style.borderRadius = '8px';
        div.style.backgroundColor = '#ecf0f1';
        
        const titulo = document.createElement('h4');
        titulo.textContent = `Compra #${historico.length - index}`;
        titulo.style.color = '#2c3e50';
        titulo.style.marginBottom = '10px';
        
        const pData = document.createElement('p');
        pData.innerHTML = `<strong>Data:</strong> ${compra.data} às ${compra.hora}`;
        
        const pRef = document.createElement('p');
        pRef.innerHTML = `<strong>Referência:</strong> ${compra.referencia}`;
        
        const pValor = document.createElement('p');
        pValor.innerHTML = `<strong>Valor:</strong> ${compra.valorFinal.toFixed(2)} €`;
        pValor.style.fontSize = '1.2rem';
        pValor.style.color = '#27ae60';
        pValor.style.fontWeight = 'bold';
        
        const pProdutos = document.createElement('p');
        pProdutos.innerHTML = `<strong>Produtos:</strong> ${compra.totalProdutos}`;
        
        const btnDetalhes = document.createElement('button');
        btnDetalhes.textContent = 'Ver Produtos';
        btnDetalhes.style.marginTop = '10px';
        
        const divProdutos = document.createElement('div');
        divProdutos.style.display = 'none';
        divProdutos.style.marginTop = '10px';
        divProdutos.style.paddingTop = '10px';
        divProdutos.style.borderTop = '1px solid #bdc3c7';
        
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'disc';
        ul.style.paddingLeft = '20px';
        
        compra.produtos.forEach(function(produto) {
            const li = document.createElement('li');
            li.textContent = `${produto.title} - ${produto.price.toFixed(2)} €`;
            ul.append(li);
        });
        
        divProdutos.append(ul);
        
        btnDetalhes.onclick = function() {
            if (divProdutos.style.display === 'none') {
                divProdutos.style.display = 'block';
                btnDetalhes.textContent = 'Ocultar Produtos';
            } else {
                divProdutos.style.display = 'none';
                btnDetalhes.textContent = 'Ver Produtos';
            }
        };
        
        div.append(titulo, pData, pRef, pValor, pProdutos, btnDetalhes, divProdutos);
        container.append(div);
    });
}
*/
// Passo 3: Adicionar função para limpar histórico:
/*
function limparHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico-compras'));
    
    if (!historico || historico.length === 0) {
        alert('Não há histórico para limpar!');
        return;
    }
    
    const confirmar = confirm(`Deseja apagar todo o histórico de compras (${historico.length} compras)?`);
    
    if (confirmar) {
        localStorage.removeItem('historico-compras');
        document.getElementById('lista-historico').innerHTML = 
            '<p class="sem-historico">Histórico limpo com sucesso!</p>';
    }
}
*/
// Passo 4: Adicionar event listeners no DOMContentLoaded:
/*
document.getElementById('btn-ver-historico').addEventListener('click', mostrarHistorico);
document.getElementById('btn-limpar-historico').addEventListener('click', limparHistorico);
*/

// MODIFICAÇÃO 24: Sistema de favoritos
// O que faz: Permite marcar produtos como favoritos
// Passo 1: Criar funções de gestão:
/*
function adicionarFavorito(produto) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    let jaExiste = false;
    favoritos.forEach(function(fav) {
        if (fav.id === produto.id) {
            jaExiste = true;
        }
    });
    
    if (!jaExiste) {
        favoritos.push(produto);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        alert(`${produto.title} adicionado aos favoritos!`);
    } else {
        alert('Este produto já está nos favoritos!');
    }
}

function removerFavorito(produtoId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    favoritos = favoritos.filter(function(fav) {
        return fav.id !== produtoId;
    });
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
}

function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const container = document.getElementById('lista-favoritos');
    container.innerHTML = '';
    
    if (favoritos.length === 0) {
        container.innerHTML = '<p>Nenhum favorito adicionado.</p>';
        return;
    }
    
    favoritos.forEach(function(produto) {
        const article = document.createElement('article');
        
        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;
        
        const imagem = document.createElement('img');
        imagem.src = produto.image;
        imagem.alt = produto.title;
        
        const preco = document.createElement('p');
        preco.className = 'price';
        preco.textContent = `${produto.price.toFixed(2)} €`;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = '❤️ Remover dos Favoritos';
        btnRemover.onclick = function() {
            removerFavorito(produto.id);
        };
        
        const btnAdicionar = document.createElement('button');
        btnAdicionar.textContent = '+ Adicionar ao Cesto';
        btnAdicionar.onclick = function() {
            adicionarAoCesto(produto);
        };
        
        article.append(titulo, imagem, preco, btnRemover, btnAdicionar);
        container.append(article);
    });
}
*/
// Passo 2: Modificar criarProduto() para adicionar botão de favorito:
/*
const btnFavorito = document.createElement('button');
btnFavorito.textContent = '♡ Favorito';
btnFavorito.style.backgroundColor = '#e74c3c';
btnFavorito.style.color = 'white';
btnFavorito.onclick = function() {
    adicionarFavorito(produto);
};

article.append(titulo, imagem, preco, btnFavorito, botao);
*/
// Passo 3: Adicionar HTML para favoritos:
// <section id="favoritos">
//   <h2>Favoritos</h2>
//   <button id="btn-ver-favoritos">Ver Favoritos</button>
//   <div id="lista-favoritos"></div>
// </section>
// Passo 4: Event listener:
/*
document.getElementById('btn-ver-favoritos').addEventListener('click', mostrarFavoritos);
*/

// MODIFICAÇÃO 25: Filtro por faixa de avaliação
// O que faz: Filtra produtos por rating mínimo
// Passo 1: Adicionar input no HTML:
// <label>Avaliação mínima:</label>
// <select id="filtro-rating">
//   <option value="">Todas</option>
//   <option value="4">4+ estrelas</option>
//   <option value="3">3+ estrelas</option>
//   <option value="2">2+ estrelas</option>
// </select>
// Passo 2: Na função filtrarProdutos(), adicionar após outros filtros:
/*
const ratingMinimo = parseFloat(document.getElementById('filtro-rating').value);

if (ratingMinimo) {
    produtosFiltrados = produtosFiltrados.filter(function(p) {
        return p.rating.rate >= ratingMinimo;
    });
}
*/
// Passo 3: Event listener no DOMContentLoaded:
/*
document.getElementById('filtro-rating').addEventListener('change', filtrarProdutos);
*/

// MODIFICAÇÃO 26: Contador de visitas à página
// O que faz: Conta quantas vezes a página foi carregada
// Adicionar no DOMContentLoaded:
/*
let visitas = parseInt(localStorage.getItem('contador-visitas')) || 0;
visitas++;
localStorage.setItem('contador-visitas', visitas);

const msgVisitas = document.createElement('p');
msgVisitas.id = 'contador-visitas';
msgVisitas.textContent = `Esta é a sua visita número ${visitas}!`;
msgVisitas.style.textAlign = 'center';
msgVisitas.style.padding = '10px';
msgVisitas.style.backgroundColor = '#3498db';
msgVisitas.style.color = 'white';
msgVisitas.style.fontWeight = 'bold';

document.body.insertBefore(msgVisitas, document.body.firstChild);
*/

// MODIFICAÇÃO 27: Pesquisa instantânea (debouncing)
// O que faz: Pesquisa enquanto digita, mas com delay
// Substituir event listener de procurar por:
/*
let timeoutPesquisa;
document.getElementById('procurar').addEventListener('input', function() {
    clearTimeout(timeoutPesquisa);
    timeoutPesquisa = setTimeout(function() {
        filtrarProdutos();
    }, 500); // Espera 500ms após parar de digitar
});
*/

// MODIFICAÇÃO 28: Exportar lista de compras para texto
// O que faz: Cria arquivo de texto com produtos do cesto
// Adicionar função:
/*
function exportarCesto() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    let texto = 'LISTA DE COMPRAS\n';
    texto += '=================\n\n';
    
    let total = 0;
    cesto.forEach(function(produto, index) {
        texto += `${index + 1}. ${produto.title}\n`;
        texto += `   Preço: ${produto.price.toFixed(2)} €\n`;
        texto += `   Categoria: ${produto.category}\n\n`;
        total += produto.price;
    });
    
    texto += '=================\n';
    texto += `TOTAL: ${total.toFixed(2)} €\n`;
    texto += `Data: ${new Date().toLocaleString()}\n`;
    
    // Criar blob e download
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-compras.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
*/
// Adicionar botão no HTML:
// <button id="btn-exportar">Exportar Lista</button>
// Event listener:
/*
document.getElementById('btn-exportar').addEventListener('click', exportarCesto);
*/

// =================================
// RESUMO DOS CONCEITOS PRINCIPAIS
// =================================
// 1. DOM Manipulation:
//    - document.querySelector/getElementById: Selecionar elementos
//    - document.createElement: Criar elementos
//    - element.append/appendChild: Adicionar ao DOM
//    - element.innerHTML/textContent: Modificar conteúdo
//    - element.style: Modificar CSS
//    - element.className: Adicionar classes
//
// 2. Event Handling:
//    - addEventListener: Associar eventos
//    - onclick, onchange, oninput: Atributos de evento
//    - Arrow functions: () => {...}
//    - DOMContentLoaded: Evento de carregamento
//
// 3. Arrays:
//    - forEach: Iterar elementos
//    - map: Transformar array
//    - filter: Filtrar elementos
//    - sort: Ordenar elementos
//    - push: Adicionar ao fim
//    - splice: Remover elementos
//    - includes: Verificar existência
//
// 4. LocalStorage:
//    - setItem: Guardar dados
//    - getItem: Recuperar dados
//    - removeItem: Apagar dados
//    - JSON.parse/stringify: Converter dados
//
// 5. Fetch API:
//    - fetch(url): Fazer pedidos HTTP
//    - async/await: Código assíncrono
//    - .then(): Processar promessas
//    - .catch(): Tratar erros
//    - GET/POST: Métodos HTTP
//
// 6. Strings:
//    - Template strings: `${variavel}`
//    - .toLowerCase(): Converter minúsculas
//    - .trim(): Remover espaços
//    - .includes(): Verificar conteúdo
//    - .slice(): Extrair parte
//
// 7. Condições e Loops:
//    - if/else: Condicionais
//    - for/forEach: Loops
//    - Operadores: &&, ||, ===, !==
//    - Operador ternário: condição ? true : false