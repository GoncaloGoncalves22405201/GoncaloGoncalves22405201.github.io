const API_URL = 'https://deisishop.pythonanywhere.com';
let produtos = [];
let categorias = [];
let referenciaAtual = 2011240049; 

// =================================
// A. INICIALIZAÇÃO DA APLICAÇÃO
// =================================
// DOMContentLoaded: Evento disparado quando o DOM está completamente construído
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAPI();
    atualizarCesto();
    
    // addEventListener: Associa eventos a elementos
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProdutos);
    document.getElementById('ordenar').addEventListener('change', filtrarProdutos);
    document.getElementById('procurar').addEventListener('input', filtrarProdutos);
    document.getElementById('btn-comprar').addEventListener('click', realizarCompra);
    document.getElementById('estudante-checkbox').addEventListener('change', calcularValorFinal);
    document.getElementById('cupao-desconto').addEventListener('input', calcularValorFinal);
});

// =================================
// B. FETCH DE DADOS
// =================================
// fetch(url): Faz pedidos HTTP e retorna Promise
// async/await: Forma moderna de lidar com código assíncrono
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
    
    // MODIFICAÇÃO 1: Ordenar produtos por preço ao carregar
    // O que faz: Ordena automaticamente do mais barato ao mais caro
    /*
    produtos.sort((a, b) => a.price - b.price);
    */
}

// =================================
// C. FUNÇÕES AUXILIARES
// =================================
function preencherCategorias() {
    const select = document.getElementById('filtro-categoria');
    
    // MODIFICAÇÃO 2: Ordenar categorias alfabeticamente
    // O que faz: Mostra categorias em ordem alfabética
    /*
    categorias.sort();
    */
    
    // forEach: Percorre array executando função para cada elemento
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
    
    // filter: Cria novo array com elementos que satisfazem condição
    if (categoriaFiltro) {
        produtosFiltrados = produtosFiltrados.filter(p => p.category === categoriaFiltro);
    }
    
    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.title.toLowerCase().includes(termoPesquisa) ||
            p.description.toLowerCase().includes(termoPesquisa)
        );
    }
    
    // MODIFICAÇÃO 3: Filtrar por intervalo de preços
    // O que faz: Filtra produtos entre preço mínimo e máximo
    // HTML: <input type="number" id="preco-min" placeholder="Preço mínimo">
    //       <input type="number" id="preco-max" placeholder="Preço máximo">
    /*
    const precoMin = parseFloat(document.getElementById('preco-min').value) || 0;
    const precoMax = parseFloat(document.getElementById('preco-max').value) || 999999;
    produtosFiltrados = produtosFiltrados.filter(p => p.price >= precoMin && p.price <= precoMax);
    
    // Event listeners no DOMContentLoaded:
    document.getElementById('preco-min').addEventListener('input', filtrarProdutos);
    document.getElementById('preco-max').addEventListener('input', filtrarProdutos);
    */
    
    // sort: Ordena elementos do array
    if (ordenacao === 'crescente') {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (ordenacao === 'decrescente') {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }
    
    // MODIFICAÇÃO 4: Ordenar por avaliação (rating)
    // O que faz: Ordena produtos pela melhor avaliação
    // HTML: <option value="rating">Melhor Avaliação</option>
    /*
    else if (ordenacao === 'rating') {
        produtosFiltrados.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    */
    
    exibirProdutos(produtosFiltrados);
}

// MODIFICAÇÃO 5: Botão para limpar filtros
// O que faz: Remove todos os filtros aplicados
// HTML: <button id="limpar-filtros">Limpar Filtros</button>
/*
function limparFiltros() {
    document.getElementById('filtro-categoria').value = '';
    document.getElementById('ordenar').value = '';
    document.getElementById('procurar').value = '';
    exibirProdutos(produtos);
}
// Event listener no DOMContentLoaded:
document.getElementById('limpar-filtros').addEventListener('click', limparFiltros);
*/

function exibirProdutos(listaProdutos) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';
    
    if (listaProdutos.length === 0) {
        container.innerHTML = '<p class="sem-produtos">Nenhum produto encontrado.</p>';
        return;
    }
    
    listaProdutos.forEach(produto => {
        const artigo = criarProduto(produto);
        container.appendChild(artigo);
    });
}

function criarProduto(produto) {
    const article = document.createElement('article');
    
    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;
    
    // MODIFICAÇÃO 9: Destacar termo pesquisado no título
    // O que faz: Marca termo pesquisado com fundo amarelo
    /*
    const termoPesquisa = document.getElementById('procurar').value;
    if (termoPesquisa) {
        const regex = new RegExp('(' + termoPesquisa + ')', 'gi');
        const partes = produto.title.split(regex);
        titulo.innerHTML = '';
        partes.forEach(parte => {
            if (parte.toLowerCase() === termoPesquisa.toLowerCase()) {
                const mark = document.createElement('mark');
                mark.textContent = parte;
                mark.style.backgroundColor = 'yellow';
                titulo.append(mark);
            } else {
                titulo.append(document.createTextNode(parte));
            }
        });
    } else {
        titulo.textContent = produto.title;
    }
    */
    
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    
    const preco = document.createElement('p');
    preco.className = 'price';
    preco.textContent = `${produto.price.toFixed(2)} €`;
    
    // MODIFICAÇÃO 6: Mostrar descrição do produto
    // O que faz: Adiciona descrição limitada abaixo do preço
    /*
    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = produto.description.substring(0, 100) + '...';
    descricao.style.fontSize = '0.9rem';
    descricao.style.color = '#666';
    */
    
    // MODIFICAÇÃO 7: Mostrar avaliação (rating) com estrelas
    // O que faz: Exibe avaliação e número de reviews
    /*
    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `${produto.rating.rate} ★ (${produto.rating.count} avaliações)`;
    rating.style.color = '#f39c12';
    rating.style.fontWeight = 'bold';
    */
    
    const botao = document.createElement('button');
    botao.textContent = '+ Adicionar ao Cesto';
    botao.addEventListener('click', () => adicionarAoCesto(produto));
    
    article.append(titulo, imagem, preco, botao);
    
    // MODIFICAÇÃO 8: Botão para ver/ocultar descrição completa
    // O que faz: Toggle para mostrar descrição completa do produto
    /*
    const descricaoCompleta = document.createElement('p');
    descricaoCompleta.textContent = produto.description;
    descricaoCompleta.style.display = 'none';
    
    const btnDetalhes = document.createElement('button');
    btnDetalhes.textContent = 'Ver Detalhes';
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
    
    return article;
}

// =================================
// D. GESTÃO DO CESTO
// =================================
// localStorage: Armazena dados que persistem após fechar browser
// JSON.parse/stringify: Converte entre objeto e string JSON
function adicionarAoCesto(produto) {
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    cesto.push(produto);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
    
    // MODIFICAÇÃO 10: Notificação ao adicionar produto
    // O que faz: Mostra mensagem temporária confirmando adição
    /*
    const notif = document.createElement('div');
    notif.textContent = `✓ ${produto.title} adicionado ao cesto!`;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = '#27ae60';
    notif.style.color = 'white';
    notif.style.padding = '15px 20px';
    notif.style.borderRadius = '5px';
    notif.style.zIndex = '1000';
    document.body.append(notif);
    setTimeout(() => notif.remove(), 2000);
    */
    
    // MODIFICAÇÃO 11: Impedir adicionar produto duplicado
    // O que faz: Verifica se produto já existe no cesto
    /*
    let cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const jaExiste = cesto.some(item => item.id === produto.id);
    
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
    calcularValorFinal();
    
    // MODIFICAÇÃO 12: Mostrar contador de produtos no cesto
    // O que faz: Exibe quantos produtos estão no cesto
    /*
    if (!document.getElementById('contador-cesto')) {
        const contador = document.createElement('p');
        contador.id = 'contador-cesto';
        contador.style.fontWeight = 'bold';
        contador.style.marginTop = '15px';
        document.getElementById('cesto').append(contador);
    }
    const texto = cesto.length === 1 ? '1 produto' : `${cesto.length} produtos`;
    document.getElementById('contador-cesto').textContent = `Total: ${texto}`;
    */
}

// MODIFICAÇÃO 14: Botão para limpar todo o cesto
// O que faz: Remove todos os produtos de uma vez
// HTML: <button id="btn-limpar-cesto">Limpar Cesto</button>
/*
function limparCesto() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    if (cesto.length === 0) {
        alert('O cesto já está vazio!');
        return;
    }
    if (confirm('Deseja remover todos os produtos do cesto?')) {
        localStorage.removeItem('cesto');
        atualizarCesto();
    }
}
// Event listener no DOMContentLoaded:
document.getElementById('btn-limpar-cesto').addEventListener('click', limparCesto);
*/

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
    
    // MODIFICAÇÃO 15: Confirmação ao remover produto
    // O que faz: Pede confirmação antes de remover
    /*
    const produto = cesto[index];
    if (!confirm(`Deseja remover ${produto.title} do cesto?`)) {
        return;
    }
    */
    
    // splice: Remove elementos do array
    cesto.splice(index, 1);
    localStorage.setItem('cesto', JSON.stringify(cesto));
    atualizarCesto();
}

// =================================
// E. CÁLCULO DE PREÇOS E DESCONTOS
// =================================
function calcularValorFinal() {
    const custoTotalElement = document.getElementById('custo-total');
    const custoTotal = parseFloat(custoTotalElement.textContent);
    const estudante = document.getElementById('estudante-checkbox').checked;
    const cupao = document.getElementById('cupao-desconto').value.trim();
    
    let valorFinal = custoTotal;
    let descontoAplicado = 0;
    
    if (estudante) {
        descontoAplicado += 0.25;
    }
    
    if (cupao) {
        descontoAplicado += 0.25;
    }
    
    // MODIFICAÇÃO 17: Validar cupões específicos
    // O que faz: Só aceita cupões de uma lista predefinida
    /*
    const cupoesValidos = ['DESCONTO2024', 'PROMO50', 'BEMVINDO'];
    if (cupao) {
        const cupaoValido = cupoesValidos.includes(cupao.toUpperCase());
        if (cupaoValido) {
            descontoAplicado += 0.25;
        } else {
            alert('Cupão inválido! Cupões válidos: ' + cupoesValidos.join(', '));
            document.getElementById('cupao-desconto').value = '';
            return;
        }
    }
    */
    
    // MODIFICAÇÃO 18: Desconto progressivo por valor de compra
    // O que faz: Aplica descontos automáticos baseados no total
    /*
    let descontoProgressivo = 0;
    if (custoTotal >= 100) {
        descontoProgressivo = 0.15;
    } else if (custoTotal >= 50) {
        descontoProgressivo = 0.10;
    } else if (custoTotal >= 30) {
        descontoProgressivo = 0.05;
    }
    descontoAplicado += descontoProgressivo;
    
    if (descontoProgressivo > 0) {
        if (!document.getElementById('desconto-progressivo')) {
            const msg = document.createElement('p');
            msg.id = 'desconto-progressivo';
            msg.style.color = '#e74c3c';
            msg.style.fontWeight = 'bold';
            document.getElementById('checkout').append(msg);
        }
        document.getElementById('desconto-progressivo').textContent = 
            `Desconto por valor: ${(descontoProgressivo * 100).toFixed(0)}%`;
    }
    */
    
    valorFinal = custoTotal * (1 - descontoAplicado);
    
    let valorFinalElement = document.getElementById('valor-final');
    let referenciaElement = document.getElementById('referencia-preview');
    
    if (!valorFinalElement) {
        valorFinalElement = document.createElement('p');
        valorFinalElement.id = 'valor-final';
        valorFinalElement.style.fontSize = '1.3rem';
        valorFinalElement.style.fontWeight = 'bold';
        valorFinalElement.style.marginTop = '20px';
        const checkout = document.getElementById('checkout');
        checkout.parentNode.insertBefore(valorFinalElement, checkout.nextSibling);
    }
    
    if (!referenciaElement) {
        referenciaElement = document.createElement('p');
        referenciaElement.id = 'referencia-preview';
        referenciaElement.style.fontSize = '1.1rem';
        referenciaElement.style.marginTop = '10px';
        valorFinalElement.parentNode.insertBefore(referenciaElement, valorFinalElement.nextSibling);
    }
    
    if (custoTotal > 0) {
        valorFinalElement.textContent = `Valor final a pagar (com eventuais descontos): ${valorFinal.toFixed(2)} €`;
        const referenciaFormatada = formatarReferencia(referenciaAtual);
        referenciaElement.textContent = `Referência de pagamento: ${referenciaFormatada}`;
    } else {
        valorFinalElement.textContent = '';
        referenciaElement.textContent = '';
    }
    
    // MODIFICAÇÃO 16: Mostrar detalhes dos descontos aplicados
    // O que faz: Exibe breakdown dos descontos
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
        const descontos = [];
        if (estudante) descontos.push('25% (Estudante)');
        if (cupao) descontos.push('25% (Cupão)');
        textoDesconto = `Descontos: ${descontos.join(' + ')} = ${(descontoAplicado * 100).toFixed(0)}% | Poupança: ${(custoTotal * descontoAplicado).toFixed(2)} €`;
    }
    document.getElementById('detalhes-desconto').textContent = textoDesconto;
    */
}

function formatarReferencia(numero) {
    const str = numero.toString();
    return str.slice(0, 6) + '-' + str.slice(6);
}

// =================================
// F. FINALIZAÇÃO DE COMPRA
// =================================
async function realizarCompra() {
    const cesto = JSON.parse(localStorage.getItem('cesto')) || [];
    
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    // MODIFICAÇÃO 19: Pedir confirmação antes de finalizar compra
    // O que faz: Mostra resumo e pede confirmação
    /*
    const totalProdutos = cesto.length;
    const valorTotal = parseFloat(document.getElementById('custo-total').textContent);
    if (!confirm(`Confirmar compra?\n\nProdutos: ${totalProdutos}\nValor: ${valorTotal.toFixed(2)} €`)) {
        return;
    }
    */
    
    referenciaAtual++;
    calcularValorFinal(); 
    
    const estudante = document.getElementById('estudante-checkbox').checked;
    const cupao = document.getElementById('cupao-desconto').value.trim();
    
    // MODIFICAÇÃO 21: Validar campos antes de comprar
    // O que faz: Verifica se cupão está correto
    /*
    if (cupao) {
        const cupoesValidos = ['DESCONTO2024', 'PROMO50', 'BEMVINDO'];
        if (!cupoesValidos.includes(cupao.toUpperCase())) {
            alert('Cupão inválido! A compra não pode ser finalizada.');
            return;
        }
    }
    */
    
    const produtos_ids = cesto.map(p => p.id);
    const dados = { products: produtos_ids };
    
    if (estudante) dados.student = true;
    if (cupao) dados.coupon = cupao;
    
    try {
        const response = await fetch(`${API_URL}/buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            const valorFinal = resultado.totalCost || resultado.total_cost;
            const referenciaFormatada = formatarReferencia(referenciaAtual - 1);
            
            // MODIFICAÇÃO 20: Guardar histórico de compras
            // O que faz: Armazena todas as compras no localStorage
            /*
            let historico = JSON.parse(localStorage.getItem('historico-compras')) || [];
            historico.push({
                data: new Date().toLocaleDateString(),
                hora: new Date().toLocaleTimeString(),
                referencia: referenciaFormatada,
                valorFinal: valorFinal,
                produtos: cesto,
                totalProdutos: cesto.length
            });
            localStorage.setItem('historico-compras', JSON.stringify(historico));
            */
            
            alert(`Compra realizada com sucesso!\nReferência: ${referenciaFormatada}\nValor Final: ${valorFinal.toFixed(2)} €`);
            
            localStorage.removeItem('cesto');
            atualizarCesto();
            document.getElementById('estudante-checkbox').checked = false;
            document.getElementById('cupao-desconto').value = '';
        }
    } catch (error) {
        console.error('Erro ao realizar compra:', error);
        
        // MODIFICAÇÃO 22: Mensagem de erro personalizada
        // O que faz: Mostra mensagem específica baseada no erro
        /*
        let mensagem = 'Erro ao processar a compra. ';
        if (error.message.includes('Failed to fetch')) {
            mensagem += 'Verifique sua conexão.';
        } else {
            mensagem += 'Tente novamente mais tarde.';
        }
        alert(mensagem);
        */
    }
}

// MODIFICAÇÃO 23: Mostrar histórico de compras
// O que faz: Cria interface para visualizar compras realizadas
// HTML: <section id="historico"><h2>Histórico</h2><button id="btn-ver-historico">Ver</button><div id="lista-historico"></div></section>
/*
function mostrarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico-compras')) || [];
    const container = document.getElementById('lista-historico');
    container.innerHTML = '';
    
    if (historico.length === 0) {
        container.innerHTML = '<p>Nenhuma compra realizada.</p>';
        return;
    }
    
    historico.reverse().forEach((compra, i) => {
        const div = document.createElement('div');
        div.style.border = '1px solid #ccc';
        div.style.padding = '10px';
        div.style.marginBottom = '10px';
        div.innerHTML = `
            <strong>Compra #${historico.length - i}</strong><br>
            Data: ${compra.data} às ${compra.hora}<br>
            Referência: ${compra.referencia}<br>
            Valor: ${compra.valorFinal.toFixed(2)} €<br>
            Produtos: ${compra.totalProdutos}
        `;
        container.append(div);
    });
}
// Event listener:
document.getElementById('btn-ver-historico').addEventListener('click', mostrarHistorico);
*/

// MODIFICAÇÃO 26: Contador de visitas à página
// O que faz: Conta quantas vezes a página foi carregada
// Adicionar no DOMContentLoaded:
/*
let visitas = parseInt(localStorage.getItem('contador-visitas')) || 0;
visitas++;
localStorage.setItem('contador-visitas', visitas);
const msg = document.createElement('p');
msg.textContent = `Visita número ${visitas}`;
msg.style.textAlign = 'center';
msg.style.padding = '10px';
msg.style.backgroundColor = '#3498db';
msg.style.color = 'white';
document.body.insertBefore(msg, document.body.firstChild);
*/

// MODIFICAÇÃO 27: Pesquisa instantânea com debouncing
// O que faz: Pesquisa com delay para otimizar performance
// Substituir event listener de procurar por:
/*
let timeoutPesquisa;
document.getElementById('procurar').addEventListener('input', function() {
    clearTimeout(timeoutPesquisa);
    timeoutPesquisa = setTimeout(() => filtrarProdutos(), 500);
});
*/