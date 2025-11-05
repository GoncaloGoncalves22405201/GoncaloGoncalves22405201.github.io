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
    
    // ===========================================================================
    // MODIFICAÇÃO 15 - PASSO 3: Event listener para limpar cesto
    // ONDE COLOCAR: Aqui, na linha 23 (logo após o addEventListener do cupao-desconto)
    // AÇÃO: Descomentar a linha abaixo quando implementar a MOD 15
    // ===========================================================================
    /*
    document.getElementById('btn-limpar-cesto').addEventListener('click', limparCesto);
    */
});

// ==============================================================================
// fetch(url): Faz pedidos HTTP assíncronos (AJAX)
// .then(response => response.json()): Converte resposta para JSON
// .then(data => {...}): Processa os dados quando chegam
// .catch(error => {...}): Trata erros
// ==============================================================================
function carregarDadosAPI() {
    // ===========================================================================
    // MODIFICAÇÃO 1: Ordenar produtos por preço ao carregar (crescente)
    // ONDE ESTÁ: Função carregarDadosAPI(), linha 40
    // COMO ATIVAR: Apagar o fetch original (linhas 52-61) e descomentar este
    // O QUE MUDA: Adiciona "produtos.sort()" na linha 44 (após produtos = data)
    // ===========================================================================
    /*
    fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then(data => {
            produtos = data;
            // ⬇️ ESTA É A LINHA NOVA (linha 44):
            produtos.sort(function(a, b) {
                return a.price - b.price;  // ordem crescente
            });
            exibirProdutos(produtos);
            carregarCategorias();
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
    */
    
    // ⬇️ CÓDIGO ORIGINAL (sem modificação) - APAGAR SE USAR MOD 1:
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
}

// ==============================================================================
// document.createElement(tag): Cria novo elemento HTML
// element.append(child): Adiciona elemento filho ao elemento pai
// Manipulação do DOM - Criar e Anexar Elementos
// ==============================================================================
function carregarCategorias() {
    // ===========================================================================
    // MODIFICAÇÃO 2: Ordenar categorias alfabeticamente
    // ONDE ESTÁ: Função carregarCategorias(), linha 78
    // COMO ATIVAR: Apagar o fetch original (linhas 85-97) e descomentar este
    // O QUE MUDA: Adiciona "categorias.sort();" na linha 82
    // ===========================================================================
    /*
    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then(categorias => {
            // ⬇️ ESTA É A LINHA NOVA (linha 82):
            categorias.sort();  // ordem alfabética
            
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
    */
    
    // ⬇️ CÓDIGO ORIGINAL (sem modificação) - APAGAR SE USAR MOD 2:
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
    
    // ===========================================================================
    // MODIFICAÇÃO 3: Adicionar ordenação por rating (avaliação)
    // ONDE COLOCAR: Aqui, na linha 160 (após o último else if de ordenacao)
    // AÇÃO: Descomentar o bloco abaixo
    // HTML NECESSÁRIO: Adicionar no select#ordenar (linha 28 do HTML):
    //                  <option value="rating">Melhor Avaliação</option>
    // ===========================================================================
    /*
    else if (ordenacao === 'rating') {
        filtrados.sort(function(a, b) {
            return b.rating.rate - a.rating.rate;  // maior rating primeiro
        });
    }
    */
    
    exibirProdutos(filtrados);
    
    // ===========================================================================
    // MODIFICAÇÃO 4: Mostrar contador de produtos encontrados
    // ONDE COLOCAR: Aqui, na linha 177 (após exibirProdutos(filtrados))
    // AÇÃO: Descomentar o bloco abaixo
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
        
        // ===========================================================================
        // MODIFICAÇÃO 5: Mostrar categoria do produto
        // ONDE COLOCAR: Aqui, na linha 217 (logo após criar o article)
        // AÇÃO: Descomentar o bloco abaixo
        // ORDEM NO ARTICLE: Esta categoria vai ANTES do título
        // ===========================================================================
        /*
        const categoria = document.createElement('p');
        categoria.className = 'categoria';
        categoria.textContent = produto.category;
        categoria.style.fontSize = '0.9rem';
        categoria.style.color = '#666';
        */
        
        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;
        
        const imagem = document.createElement('img');
        imagem.src = produto.image;
        imagem.alt = produto.title;
        
        const preco = document.createElement('p');
        preco.className = 'price';
        preco.textContent = `${produto.price.toFixed(2)} €`;
        
        // ===========================================================================
        // MODIFICAÇÃO 6: Mostrar rating (avaliação) do produto
        // ONDE COLOCAR: Aqui, na linha 242 (logo após definir preco.textContent)
        // AÇÃO: Descomentar o bloco abaixo
        // ORDEM NO ARTICLE: Este rating vai APÓS o preço
        // ===========================================================================
        /*
        const rating = document.createElement('p');
        rating.className = 'rating';
        rating.textContent = `${produto.rating.rate} ★ (${produto.rating.count} avaliações)`;
        rating.style.color = '#ffa500';
        */
        
        // ===========================================================================
        // MODIFICAÇÃO 7: Botão toggle para mostrar/ocultar descrição
        // ONDE COLOCAR: Aqui, na linha 253 (após criar rating ou preco)
        // AÇÃO: Descomentar o bloco abaixo
        // ORDEM NO ARTICLE: Descrição e botão toggle vão ANTES do botão adicionar
        // ===========================================================================
        /*
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
        */
        
        // ===========================================================================
        // MODIFICAÇÃO 17: Adicionar input para quantidade
        // ONDE COLOCAR: Aqui, na linha 278 (antes de criar o botão)
        // AÇÃO: Descomentar o bloco abaixo
        // ORDEM NO ARTICLE: Input vai ANTES do botão adicionar
        // ===========================================================================
        /*
        const inputQtd = document.createElement('input');
        inputQtd.type = 'number';
        inputQtd.min = '1';
        inputQtd.value = '1';
        inputQtd.style.width = '60px';
        inputQtd.style.marginRight = '10px';
        */
        
        const botao = document.createElement('button');
        botao.textContent = '+ Adicionar ao Cesto';
        
        // ===========================================================================
        // MODIFICAÇÃO 17 (CONTINUAÇÃO): Modificar onclick do botão
        // ONDE ESTÁ: Linha 295 (botao.onclick atual)
        // AÇÃO: Apagar o botao.onclick original (linhas 295-297) e descomentar este
        // IMPORTANTE: Só funciona se criou o inputQtd acima!
        // ===========================================================================
        /*
        botao.onclick = function() {
            const quantidade = parseInt(inputQtd.value) || 1;
            for (let i = 0; i < quantidade; i++) {
                adicionarAoCesto(produto);
            }
        };
        */
        
        // ⬇️ CÓDIGO ORIGINAL (sem modificação) - APAGAR SE USAR MOD 17:
        botao.onclick = function() {
            adicionarAoCesto(produto);
        };
        
        // ===========================================================================
        // APPEND DOS ELEMENTOS - ORDEM CORRETA
        // ONDE ESTÁ: Linhas 314-317
        // COMO MODIFICAR: Apagar as 4 linhas originais e descomentar o bloco que usar
        // ===========================================================================
        
        // ⬇️ OPÇÃO A: SEM MODIFICAÇÕES (código original)
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(botao);
        
        // ⬇️ OPÇÃO B: COM TODAS AS MODIFICAÇÕES (5, 6, 7, 17)
        // Apagar as 4 linhas acima e descomentar este bloco:
        /*
        article.append(categoria);      // MOD 5
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(rating);         // MOD 6
        article.append(btnToggle);      // MOD 7
        article.append(descricao);      // MOD 7
        article.append(inputQtd);       // MOD 17
        article.append(botao);
        */
        
        // ⬇️ OPÇÃO C: Só MOD 5 e 6
        /*
        article.append(categoria);      // MOD 5
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(rating);         // MOD 6
        article.append(botao);
        */
        
        // ⬇️ OPÇÃO D: Só MOD 7
        /*
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(btnToggle);      // MOD 7
        article.append(descricao);      // MOD 7
        article.append(botao);
        */
        
        container.append(article);
    });
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
    // ===========================================================================
    // MODIFICAÇÃO 9: Evitar produtos duplicados no cesto
    // ONDE ESTÁ: Função adicionarAoCesto() completa, linha 376
    // COMO ATIVAR: Apagar o conteúdo original (linhas 392-396) e descomentar este
    // ATENÇÃO: Esta modificação SUBSTITUI todo o conteúdo da função!
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
    
    // ⬇️ CÓDIGO ORIGINAL (sem modificação) - APAGAR SE USAR MOD 9:
    const cesto = getCesto();
    cesto.push(produto);
    setCesto(cesto);
    atualizarCesto();
    
    // ===========================================================================
    // MODIFICAÇÃO 8: Notificação visual ao adicionar produto
    // ONDE COLOCAR: Aqui, na linha 420 (após atualizarCesto())
    // AÇÃO: Descomentar o bloco abaixo
    // FUNCIONA COM: Código original OU com MOD 9
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
        // ===========================================================================
        // MODIFICAÇÃO 16: Agrupar produtos repetidos com quantidade
        // ONDE ESTÁ: Todo o bloco else {} da função, linha 470
        // COMO ATIVAR: Apagar TODO o else {} original (linhas 470-501) e descomentar
        // ATENÇÃO: Esta é a modificação MAIS LONGA - substitui 31 linhas!
        // ===========================================================================
        /*
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
        */
        
        // ⬇️ CÓDIGO ORIGINAL (sem modificação) - APAGAR SE USAR MOD 16:
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
    // ONDE COLOCAR: Aqui, na linha 507 (após calcularValorFinal())
    // AÇÃO: Descomentar o bloco abaixo
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
    
    // ===========================================================================
    // MODIFICAÇÃO 11: Validar cupões específicos
    // ONDE ESTÁ: Linhas 547-550 (verificação do cupão)
    // COMO ATIVAR: Apagar as 4 linhas originais e descomentar este bloco
    // ===========================================================================
    /*
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
    
    // ⬇️ CÓDIGO ORIGINAL (sem modificação) - APAGAR SE USAR MOD 11:
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
    // MODIFICAÇÃO 12: Mostrar detalhes dos descontos aplicados
    // ONDE COLOCAR: Aqui, na linha 605 (no final da função, após o último })
    // AÇÃO: Descomentar o bloco abaixo
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
    
    // ===========================================================================
    // MODIFICAÇÃO 13: Confirmar antes de finalizar compra
    // ONDE COLOCAR: Aqui, na linha 662 (logo após o if de cesto vazio)
    // AÇÃO: Descomentar o bloco abaixo
    // ===========================================================================
    /*
    const totalProdutos = cesto.length;
    const confirmar = confirm(`Deseja finalizar a compra de ${totalProdutos} produto(s)?`);
    if (!confirmar) {
        return;  // cancela a compra
    }
    */
    
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
    
    // ===========================================================================
    // MODIFICAÇÃO 14 - PARTE 1: Desativar botão durante processamento
    // ONDE COLOCAR: Aqui, na linha 701 (logo após "dados.coupon = cupao;")
    // AÇÃO: Descomentar o bloco abaixo
    // IMPORTANTE: Descomentar também as PARTES 2 e 3 mais abaixo!
    // ===========================================================================
    /*
    const botaoComprar = document.getElementById('btn-comprar');
    const textoOriginal = botaoComprar.textContent;
    botaoComprar.textContent = 'Processando compra...';
    botaoComprar.disabled = true;
    */
    
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
        
        // ===========================================================================
        // MODIFICAÇÃO 14 - PARTE 2: Reativar botão após sucesso
        // ONDE COLOCAR: Aqui, na linha 736 (após limpar cupão)
        // AÇÃO: Descomentar as 2 linhas abaixo
        // ===========================================================================
        /*
        botaoComprar.textContent = textoOriginal;
        botaoComprar.disabled = false;
        */
    })
    .catch(function(error) {
        console.error('Erro ao realizar compra:', error);
        alert('Erro ao realizar compra. Tente novamente.');
        
        // ===========================================================================
        // MODIFICAÇÃO 14 - PARTE 3: Reativar botão após erro
        // ONDE COLOCAR: Aqui, na linha 749 (após o alert de erro)
        // AÇÃO: Descomentar as 2 linhas abaixo
        // ===========================================================================
        /*
        botaoComprar.textContent = textoOriginal;
        botaoComprar.disabled = false;
        */
    });
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
// MODIFICAÇÃO 15 - PASSOS 1 e 2: Função para limpar todo o cesto
// ONDE COLOCAR: Aqui, na linha 785 (após a função setCesto)
// AÇÃO: Descomentar o bloco abaixo
// HTML NECESSÁRIO: Ver instruções no ficheiro HTML abaixo
// ===========================================================================
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