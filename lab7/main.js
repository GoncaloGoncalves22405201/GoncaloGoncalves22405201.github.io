const API_URL = 'https://deisishop.pythonanywhere.com';
let produtos = [];
let referenciaAtual = 2011240049;

// ==============================================================================
// DOMContentLoaded: Evento disparado quando o DOM está totalmente construído
// Permite colocar <script> no <head> sem problemas
// ==============================================================================
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosAPI();
    atualizarCesto();
    
    // addEventListener: Forma moderna de associar eventos a elementos
    // addEventListener(evento, handler) - permite múltiplos handlers
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProdutos);
    document.getElementById('ordenar').addEventListener('change', filtrarProdutos);
    document.getElementById('procurar').addEventListener('input', filtrarProdutos);
    
    document.getElementById('btn-comprar').addEventListener('click', realizarCompra);
    document.getElementById('estudante-checkbox').addEventListener('change', calcularValorFinal);
    document.getElementById('cupao-desconto').addEventListener('input', calcularValorFinal);
});

// ==============================================================================
// fetch(url): Faz pedidos HTTP assíncronos (AJAX)
// .then(response => response.json()): Converte resposta para JSON
// .then(data => {...}): Processa os dados quando chegam
// .catch(error => {...}): Trata erros
// ==============================================================================
function carregarDadosAPI() {
    fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then(data => {
            produtos = data;
            exibirProdutos(produtos);
            carregarCategorias();
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
    
    // ===========================================================================
    // MODIFICAÇÃO 1: Ordenar produtos por preço ao carregar (crescente)
    // O que faz: Ordena array de produtos do mais barato ao mais caro
    // Conceitos: array.sort((a,b) => a.price - b.price)
    // ===========================================================================
    /*
    fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then(data => {
            produtos = data;
            produtos.sort(function(a, b) {
                return a.price - b.price;  // ordem crescente
            });
            exibirProdutos(produtos);
            carregarCategorias();
        })
    */
}

// ==============================================================================
// document.createElement(tag): Cria novo elemento HTML
// element.append(child): Adiciona elemento filho ao elemento pai
// Manipulação do DOM - Criar e Anexar Elementos
// ==============================================================================
function carregarCategorias() {
    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then(categorias => {
            const select = document.getElementById('filtro-categoria');
            categorias.forEach(function(cat) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.append(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
        });
    
    // ===========================================================================
    // MODIFICAÇÃO 2: Ordenar categorias alfabeticamente
    // O que faz: Ordena array de strings por ordem alfabética
    // Conceitos: array.sort() - sem callback ordena alfabeticamente
    // ===========================================================================
    /*
    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then(categorias => {
            categorias.sort();  // ordem alfabética
            const select = document.getElementById('filtro-categoria');
            categorias.forEach(function(cat) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.append(option);
            });
        })
    */
}

// ==============================================================================
// array.forEach(callback): Percorre array executando função para cada elemento
// array.sort((a,b) => ...): Ordena array modificando-o
// string.toLowerCase(): Converte string para minúsculas
// string.includes(termo): Verifica se string contém termo
// ==============================================================================
function filtrarProdutos() {
    const categoria = document.getElementById('filtro-categoria').value;
    const ordenacao = document.getElementById('ordenar').value;
    const pesquisa = document.getElementById('procurar').value.toLowerCase();
    
    // Filtrar produtos usando forEach
    let filtrados = [];
    produtos.forEach(function(p) {
        const categoriaMatch = !categoria || p.category === categoria;
        const pesquisaMatch = !pesquisa || 
            p.title.toLowerCase().includes(pesquisa) || 
            p.description.toLowerCase().includes(pesquisa);
        
        if (categoriaMatch && pesquisaMatch) {
            filtrados.push(p);
        }
    });
    
    // array.sort(): Ordena array com função de comparação
    // return a.price - b.price (crescente)
    // return b.price - a.price (decrescente)
    if (ordenacao === 'crescente') {
        filtrados.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (ordenacao === 'decrescente') {
        filtrados.sort(function(a, b) {
            return b.price - a.price;
        });
    }
    
    exibirProdutos(filtrados);
    
    // ===========================================================================
    // MODIFICAÇÃO 3: Adicionar ordenação por rating (avaliação)
    // O que faz: Ordena produtos pela avaliação mais alta primeiro
    // Conceitos: produto.rating.rate, array.sort()
    // Passo 1: Adicionar no HTML <select id="ordenar">:
    //          <option value="rating">Melhor Avaliação</option>
    // Passo 2: Adicionar após as outras condições de ordenação:
    // ===========================================================================
    /*
    else if (ordenacao === 'rating') {
        filtrados.sort(function(a, b) {
            return b.rating.rate - a.rating.rate;  // maior rating primeiro
        });
    }
    */
    
    // ===========================================================================
    // MODIFICAÇÃO 4: Mostrar contador de produtos encontrados
    // O que faz: Exibe número de produtos que correspondem aos filtros
    // Conceitos: document.createElement(), element.append(), array.length
    // ===========================================================================
    /*
    if (!document.getElementById('contador-produtos')) {
        const contador = document.createElement('p');
        contador.id = 'contador-produtos';
        contador.style.fontWeight = 'bold';
        contador.style.marginBottom = '10px';
        document.getElementById('lista-produtos').parentElement
            .insertBefore(contador, document.getElementById('lista-produtos'));
    }
    document.getElementById('contador-produtos').textContent = 
        `${filtrados.length} produto(s) encontrado(s)`;
    */
}

// ==============================================================================
// element.innerHTML = '': Limpa conteúdo HTML do elemento
// element.textContent = texto: Define texto do elemento
// element.className = 'nome': Define classe CSS
// element.src / element.alt: Define atributos da imagem
// button.onclick = function(): Associa evento click (forma 2)
// ==============================================================================
function exibirProdutos(lista) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';
    
    if (lista.length === 0) {
        container.innerHTML = '<p class="sem-produtos">Nenhum produto encontrado.</p>';
        return;
    }
    
    lista.forEach(function(produto) {
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
        botao.onclick = function() {
            adicionarAoCesto(produto);
        };
        
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(botao);
        
        container.append(article);
    });
    
    // ===========================================================================
    // MODIFICAÇÃO 5: Mostrar categoria do produto
    // O que faz: Adiciona a categoria acima do título
    // Conceitos: document.createElement(), element.textContent, element.style
    // ===========================================================================
    /*
    // Adicionar ANTES do título:
    const categoria = document.createElement('p');
    categoria.className = 'categoria';
    categoria.textContent = produto.category;
    categoria.style.fontSize = '0.9rem';
    categoria.style.color = '#666';
    
    article.append(categoria);  // adicionar primeiro
    article.append(titulo);
    article.append(imagem);
    article.append(preco);
    article.append(botao);
    */
    
    // ===========================================================================
    // MODIFICAÇÃO 6: Mostrar rating (avaliação) do produto
    // O que faz: Exibe estrelas e número de avaliações abaixo do preço
    // Conceitos: produto.rating.rate, produto.rating.count
    // ===========================================================================
    /*
    // Adicionar APÓS o preço:
    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `${produto.rating.rate} ★ (${produto.rating.count} avaliações)`;
    rating.style.color = '#ffa500';
    
    article.append(titulo);
    article.append(imagem);
    article.append(preco);
    article.append(rating);  // adicionar aqui
    article.append(botao);
    */
    
    // ===========================================================================
    // MODIFICAÇÃO 7: Botão toggle para mostrar/ocultar descrição
    // O que faz: Adiciona botão que alterna visibilidade da descrição completa
    // Conceitos: element.style.display, onclick, condição if/else
    // ===========================================================================
    /*
    // Adicionar ANTES do botão de adicionar ao cesto:
    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = produto.description;
    descricao.style.display = 'none';  // escondido inicialmente
    descricao.style.fontSize = '0.9rem';
    descricao.style.marginTop = '10px';
    
    const btnToggle = document.createElement('button');
    btnToggle.textContent = 'Ver Descrição';
    btnToggle.onclick = function() {
        if (descricao.style.display === 'none') {
            descricao.style.display = 'block';
            btnToggle.textContent = 'Esconder Descrição';
        } else {
            descricao.style.display = 'none';
            btnToggle.textContent = 'Ver Descrição';
        }
    };
    
    article.append(titulo);
    article.append(imagem);
    article.append(preco);
    article.append(btnToggle);
    article.append(descricao);
    article.append(botao);
    */
}

// ==============================================================================
// localStorage: Armazena dados que persistem após fechar browser
// localStorage.getItem(chave): Obtém valor
// localStorage.setItem(chave, valor): Define valor
// JSON.parse(string): Converte string JSON em objeto JavaScript
// JSON.stringify(objeto): Converte objeto em string JSON
// array.push(elemento): Adiciona elemento ao fim do array
// ==============================================================================
function adicionarAoCesto(produto) {
    const cesto = getCesto();
    cesto.push(produto);
    setCesto(cesto);
    atualizarCesto();
    
    // ===========================================================================
    // MODIFICAÇÃO 8: Notificação visual ao adicionar produto
    // O que faz: Mostra mensagem temporária confirmando adição ao cesto
    // Conceitos: document.createElement(), element.style, setTimeout(), remove()
    // ===========================================================================
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
    
    setTimeout(function() {
        notif.remove();
    }, 2000);  // remove após 2 segundos
    */
    
    // ===========================================================================
    // MODIFICAÇÃO 9: Evitar produtos duplicados no cesto
    // O que faz: Verifica se produto já existe antes de adicionar
    // Conceitos: array.find(), produto.id, alert()
    // ===========================================================================
    /*
    const cesto = getCesto();
    
    // Procurar produto existente
    let produtoExiste = false;
    cesto.forEach(function(p) {
        if (p.id === produto.id) {
            produtoExiste = true;
        }
    });
    
    if (produtoExiste) {
        alert('Este produto já está no cesto!');
        return;  // não adiciona
    }
    
    cesto.push(produto);
    setCesto(cesto);
    atualizarCesto();
    */
}

// ==============================================================================
// array.splice(index, quantidade): Remove elementos do array
// Remove 1 elemento na posição index
// ==============================================================================
function removerDoCesto(index) {
    const cesto = getCesto();
    cesto.splice(index, 1);
    setCesto(cesto);
    atualizarCesto();
}

// ==============================================================================
// array.forEach((elemento, indice) => {...}): forEach com índice
// Permite aceder ao índice de cada elemento durante iteração
// ==============================================================================
function atualizarCesto() {
    const cesto = getCesto();
    const container = document.getElementById('produtos-selecionados');
    container.innerHTML = '';
    
    let total = 0;
    
    if (cesto.length === 0) {
        container.innerHTML = '<p>O seu cesto está vazio.</p>';
    } else {
        cesto.forEach(function(produto, index) {
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
            botao.onclick = function() {
                removerDoCesto(index);
            };
            
            article.append(titulo);
            article.append(imagem);
            article.append(preco);
            article.append(botao);
            
            container.append(article);
            
            total = total + produto.price;
        });
    }
    
    document.getElementById('custo-total').textContent = total.toFixed(2);
    calcularValorFinal();
    
    // ===========================================================================
    // MODIFICAÇÃO 10: Mostrar contador de produtos no cesto
    // O que faz: Exibe quantidade total de produtos no cesto
    // Conceitos: array.length, document.createElement(), element.append()
    // ===========================================================================
    /*
    if (!document.getElementById('contador-cesto')) {
        const contador = document.createElement('p');
        contador.id = 'contador-cesto';
        contador.style.fontWeight = 'bold';
        contador.style.fontSize = '1.1rem';
        contador.style.marginTop = '15px';
        document.getElementById('produtos-selecionados').parentElement.append(contador);
    }
    
    document.getElementById('contador-cesto').textContent = 
        cesto.length === 0 ? '' : `Total de produtos no cesto: ${cesto.length}`;
    */
}

// ==============================================================================
// element.style.propriedade: Modifica CSS inline de um elemento
// parseFloat(string): Converte string para número decimal
// element.checked: Verifica se checkbox está marcado
// element.value: Obtém valor de input
// string.trim(): Remove espaços em branco no início e fim
// ==============================================================================
function calcularValorFinal() {
    const total = parseFloat(document.getElementById('custo-total').textContent);
    
    let desconto = 0;
    
    // Verificar checkbox de estudante
    if (document.getElementById('estudante-checkbox').checked) {
        desconto = desconto + 0.25;  // 25%
    }
    
    // Verificar cupão de desconto
    if (document.getElementById('cupao-desconto').value.trim()) {
        desconto = desconto + 0.25;  // 25%
    }
    
    const valorFinal = total * (1 - desconto);
    
    // Criar elemento para valor final se não existir
    if (!document.getElementById('valor-final')) {
        const elemValor = document.createElement('p');
        elemValor.id = 'valor-final';
        elemValor.style.fontSize = '1.3rem';
        elemValor.style.fontWeight = 'bold';
        elemValor.style.marginTop = '20px';
        document.getElementById('checkout').append(elemValor);
    }
    
    // Criar elemento para referência se não existir
    if (!document.getElementById('referencia-preview')) {
        const elemRef = document.createElement('p');
        elemRef.id = 'referencia-preview';
        elemRef.style.fontSize = '1.1rem';
        elemRef.style.marginTop = '10px';
        document.getElementById('checkout').append(elemRef);
    }
    
    if (total > 0) {
        document.getElementById('valor-final').textContent = 
            `Valor final a pagar (com eventuais descontos): ${valorFinal.toFixed(2)} €`;
        document.getElementById('referencia-preview').textContent = 
            `Referência de pagamento: ${formatarReferencia(referenciaAtual)}`;
    } else {
        document.getElementById('valor-final').textContent = '';
        document.getElementById('referencia-preview').textContent = '';
    }
    
    // ===========================================================================
    // MODIFICAÇÃO 11: Validar cupões específicos
    // O que faz: Só aplica desconto se cupão for válido (lista pré-definida)
    // Conceitos: array de strings, string.toUpperCase(), comparação
    // ===========================================================================
    /*
    // SUBSTITUIR a verificação do cupão por:
    const cupao = document.getElementById('cupao-desconto').value.trim().toUpperCase();
    const cupoesValidos = ['DESCONTO2024', 'PROMO50', 'ESTUDANTE'];
    
    let cupaoValido = false;
    cupoesValidos.forEach(function(c) {
        if (c === cupao) {
            cupaoValido = true;
        }
    });
    
    if (cupaoValido) {
        desconto = desconto + 0.25;
    } else if (cupao !== '') {
        alert('Cupão inválido!');
        document.getElementById('cupao-desconto').value = '';
    }
    */
    
    // ===========================================================================
    // MODIFICAÇÃO 12: Mostrar detalhes dos descontos aplicados
    // O que faz: Exibe texto com tipos de desconto aplicados
    // Conceitos: concatenação de strings, condições if, element.textContent
    // ===========================================================================
    /*
    if (!document.getElementById('info-desconto')) {
        const info = document.createElement('p');
        info.id = 'info-desconto';
        info.style.fontSize = '0.95rem';
        info.style.color = '#27ae60';
        info.style.marginTop = '10px';
        document.getElementById('checkout').append(info);
    }
    
    let textoDesconto = '';
    if (desconto > 0) {
        textoDesconto = 'Descontos aplicados: ';
        if (document.getElementById('estudante-checkbox').checked) {
            textoDesconto = textoDesconto + '25% estudante ';
        }
        if (document.getElementById('cupao-desconto').value.trim()) {
            textoDesconto = textoDesconto + '+ 25% cupão ';
        }
        textoDesconto = textoDesconto + `(Total: ${(desconto * 100).toFixed(0)}%)`;
    }
    document.getElementById('info-desconto').textContent = textoDesconto;
    */
}

// ==============================================================================
// string.toString(): Converte número para string
// string.slice(inicio, fim): Extrai parte da string
// ==============================================================================
function formatarReferencia(num) {
    const str = num.toString();
    return `${str.slice(0, 6)}-${str.slice(6)}`;
}

// ==============================================================================
// fetch POST: Envia dados ao servidor
// method: 'POST' - Método HTTP para criar recurso
// headers: Define tipo de conteúdo (JSON)
// body: Dados a enviar (tem de ser string JSON)
// JSON.stringify(objeto): Converte objeto JavaScript em string JSON
// array.map(callback): Cria novo array aplicando função a cada elemento
// ==============================================================================
function realizarCompra() {
    const cesto = getCesto();
    
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    referenciaAtual++;
    calcularValorFinal();
    
    // Construir objeto com dados da compra
    const dados = {
        products: []
    };
    
    // Extrair IDs dos produtos
    cesto.forEach(function(p) {
        dados.products.push(p.id);
    });
    
    // Adicionar desconto de estudante se aplicável
    if (document.getElementById('estudante-checkbox').checked) {
        dados.student = true;
    }
    
    // Adicionar cupão se preenchido
    const cupao = document.getElementById('cupao-desconto').value.trim();
    if (cupao) {
        dados.coupon = cupao;
    }
    
    // Enviar pedido POST à API
    fetch(`${API_URL}/buy/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(function(resultado) {
        const valorFinal = resultado.totalCost || resultado.total_cost;
        
        alert(`Compra realizada com sucesso!\nReferência: ${formatarReferencia(referenciaAtual - 1)}\nValor Final: ${valorFinal.toFixed(2)} €`);
        
        // Limpar cesto e formulário
        localStorage.removeItem('cesto');
        atualizarCesto();
        document.getElementById('estudante-checkbox').checked = false;
        document.getElementById('cupao-desconto').value = '';
    })
    .catch(function(error) {
        console.error('Erro ao realizar compra:', error);
        alert('Erro ao realizar compra. Tente novamente.');
    });
    
    // ===========================================================================
    // MODIFICAÇÃO 13: Confirmar antes de finalizar compra
    // O que faz: Mostra janela de confirmação antes de enviar pedido
    // Conceitos: confirm(), return (interrompe função)
    // ===========================================================================
    /*
    // Adicionar DEPOIS da verificação if (cesto.length === 0):
    
    const totalProdutos = cesto.length;
    const confirmar = confirm(`Deseja finalizar a compra de ${totalProdutos} produto(s)?`);
    if (!confirmar) {
        return;  // cancela a compra
    }
    */
    
    // ===========================================================================
    // MODIFICAÇÃO 14: Desativar botão durante processamento
    // O que faz: Mostra "Processando..." e desativa botão durante compra
    // Conceitos: element.textContent, element.disabled, variáveis
    // ===========================================================================
    /*
    // Adicionar ANTES do fetch:
    const botaoComprar = document.getElementById('btn-comprar');
    const textoOriginal = botaoComprar.textContent;
    botaoComprar.textContent = 'Processando compra...';
    botaoComprar.disabled = true;
    
    // No .then de sucesso, adicionar no FINAL:
    botaoComprar.textContent = textoOriginal;
    botaoComprar.disabled = false;
    
    // No .catch, adicionar no FINAL:
    botaoComprar.textContent = textoOriginal;
    botaoComprar.disabled = false;
    */
}

// ==============================================================================
// localStorage.getItem(chave): Recupera dados do localStorage
// JSON.parse(string): Converte string JSON em objeto/array JavaScript
// Retorna array vazio [] se não existir dados
// ==============================================================================
function getCesto() {
    const cestoJSON = localStorage.getItem('cesto');
    if (cestoJSON) {
        return JSON.parse(cestoJSON);
    }
    return [];
}

// ==============================================================================
// localStorage.setItem(chave, valor): Guarda dados no localStorage
// JSON.stringify(objeto): Converte objeto/array em string JSON
// Dados persistem mesmo após fechar o browser
// ==============================================================================
function setCesto(cesto) {
    localStorage.setItem('cesto', JSON.stringify(cesto));
}

// ==============================================================================
// MODIFICAÇÃO 15: Botão para limpar todo o cesto
// O que faz: Remove todos os produtos do cesto de uma vez
// Conceitos: localStorage.removeItem(), confirm(), addEventListener
// 
// Passo 1: Adicionar botão no HTML (dentro de <section id="cesto">):
// <button id="btn-limpar-cesto">Limpar Cesto Completo</button>
//
// Passo 2: Adicionar função:
// ==============================================================================
/*
function limparCesto() {
    const cesto = getCesto();
    if (cesto.length === 0) {
        alert('O cesto já está vazio!');
        return;
    }
    
    const confirmar = confirm('Tem certeza que deseja remover todos os produtos?');
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

// ==============================================================================
// MODIFICAÇÃO 16: Agrupar produtos repetidos com quantidade
// O que faz: Conta produtos iguais e mostra "Produto x3" em vez de repetir
// Conceitos: objeto {}, for...in, propriedades de objetos
// ==============================================================================
/*
// SUBSTITUIR todo o else {} da função atualizarCesto() por:

else {
    // Agrupar produtos por ID
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
                quantidade: 1
            };
        }
    });
    
    // Criar elementos para cada grupo
    for (let id in produtosAgrupados) {
        const item = produtosAgrupados[id];
        const article = document.createElement('article');
        
        const titulo = document.createElement('h3');
        titulo.textContent = `${item.title} (x${item.quantidade})`;
        
        const imagem = document.createElement('img');
        imagem.src = item.image;
        imagem.alt = item.title;
        
        const preco = document.createElement('p');
        preco.className = 'price';
        const precoTotal = item.price * item.quantidade;
        preco.textContent = `${precoTotal.toFixed(2)} €`;
        
        const botao = document.createElement('button');
        botao.textContent = '- Remover';
        botao.onclick = function() {
            // Encontrar primeira ocorrência do produto no cesto original
            let index = -1;
            for (let i = 0; i < cesto.length; i++) {
                if (cesto[i].id === item.id) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                removerDoCesto(index);
            }
        };
        
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(botao);
        container.append(article);
        
        total = total + (item.price * item.quantidade);
    }
}
*/

// ==============================================================================
// MODIFICAÇÃO 17: Adicionar input para quantidade ao adicionar produto
// O que faz: Permite escolher quantas unidades adicionar ao cesto
// Conceitos: input type="number", parseInt(), for loop
// ==============================================================================
/*
// No exibirProdutos(), ANTES do botão de adicionar:

const inputQtd = document.createElement('input');
inputQtd.type = 'number';
inputQtd.min = '1';
inputQtd.value = '1';
inputQtd.style.width = '60px';
inputQtd.style.marginRight = '10px';

// MODIFICAR o botao.onclick:
botao.onclick = function() {
    const quantidade = parseInt(inputQtd.value) || 1;
    for (let i = 0; i < quantidade; i++) {
        adicionarAoCesto(produto);
    }
};

// Adicionar ao article:
article.append(titulo);
article.append(imagem);
article.append(preco);
article.append(inputQtd);  // adicionar input
article.append(botao);
*/