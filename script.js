const container = document.querySelector('.container');
const panel = document.getElementById('panel');
const operationButtons = document.querySelectorAll('.operation-button');

let currentOperation = null;
let form = null;
let products = [];
let lastId = 0;
let repeatButton = null;
let panelInformation = {
    index: null,
    operation: null
};
let eyeButtons = null;
let linesInformation = [];
let lineInformation = [];

operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        const operation = operationButton.classList[0]; // 'create', 'read', 'updateQuery', ou 'delete'

        if (currentOperation === operation) {
            operationButton.classList.remove('active');
            container.innerHTML = loadWelcomeContent();
            currentOperation = null;
            formButton = null;
            buildPanel();
        }
        else {
            operationButtons.forEach(btn => {btn.classList.remove('active');});

            operationButton.classList.add('active');
            currentOperation = operation;
            loadOperationForm(operation);
        }

        window.scrollTo(0, 0);
    });
});

function loadOperationForm(operation, data = null) {
    switch (operation) {
        case 'create':
            container.innerHTML = loadCreateForm();
            break;
        case 'read':
            container.innerHTML = loadReadForm();
            break;
        case 'updateQuery':
            container.innerHTML = loadUpdateQueryForm();
            break;
        case 'update':
            container.innerHTML = loadUpdateForm(data);
            break;
        case 'delete':
            container.innerHTML = loadDeleteForm();
            break;
        default:
            container.innerHTML = `<form>
                                        <div class="form-header">
                                            <h1>Operação inválida</h1>
                                            <legend>
                                                1. A operação ${operation} não é reconhecida.
                                                <br>
                                                2. São possíveis apenas as operações Inserção, Consulta, Alteração e Exclusão.
                                                <br>
                                                3. Por favor, selecione uma operação válida no menu inferior.
                                            </legend>
                                        </div>
                                        <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                    </form>`
            ;
            break;
    }

    form = container.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        DAO(formData, operation, data);
    });
}

function loadWelcomeContent (){
    return `<div class="content">
                    <h2>Bem-vindo(a) ao Simulador de Operações CRUD em Arquivos Estruturados</h2>
                    <p>
                        Este projeto foi desenvolvido com o objetivo de oferecer a você, estudante de Ciência da Computação, 
                        uma visualização prática de como as operações fundamentais de <strong><a href="https://pt.wikipedia.org/wiki/CRUD" target="_blank">CRUD</a></strong> (Create, Read, Update, Delete)
                        impactam diretamente um arquivo estruturado em nível de bytes.
                    </p>
                </div>

                <div class="content">
                    <h2>Como Funciona</h2>
                    <p>
                        Para iniciar sua exploração, basta selecionar uma das operações <strong><a href="https://pt.wikipedia.org/wiki/CRUD" target="_blank">CRUD</a></strong> disponíveis no menu inferior. Para retornar a esta seção, clique novamente no botão da operação selecionada. 
                        <span>Siga as instruções passo a passo para um aprendizado claro e sem complicações.</span>
                    </p>
                </div>

                <div class="content">
                    <h2>Visualização e Decodificação</h2>
                    <p>
                        O resultado de cada operação será exibido em tempo real no "<a href="./#panel" class="panel">Painel de visualização</a>"
                    
                        <ul>
                            <li>
                                <strong>Formato Padrão:</strong> Os dados são apresentados em formato <strong><a href="https://pt.wikipedia.org/wiki/Sistema_de_numera%C3%A7%C3%A3o_hexadecimal" target="_blank">hexadecimal</a></strong>, permitindo que você observe 
                                a representação exata dos bytes no arquivo.
                            </li>
                            <li>
                                <strong>Decodificação Simples:</strong> Para facilitar a compreensão do conteúdo, você pode decodificar a informação de uma linha específica 
                                para o formato de texto legível. Basta clicar no ícone 
                                <span>
                                    <svg class="eye" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </span> 
                                localizado no final de cada linha. Clique novamente no ícone para retornar à visualização <strong><a href="https://pt.wikipedia.org/wiki/Sistema_de_numera%C3%A7%C3%A3o_hexadecimal" target="_blank">hexadecimal</a></strong>.
                            </li>
                        </ul>
                    </p>
                </div>

                <div class="content">
                    <h2>Sua Contribuição é Importante</h2>
                    <p>
                        Após experimentar as operações e entender o fluxo de dados, convidamos você a contribuir para o aprimoramento deste trabalho.<br>
                        Clique no botão "<strong>Avaliar</strong>" no cabeçalho e responda ao breve questionário. Sua avaliação sobre a usabilidade e utilidade didática 
                        deste projeto é fundamental para a comunidade acadêmica.
                    </p>
                </div>`
    ;
}

function loadCreateForm() {
    return `<form>
                <div class="form-header">
                    <h1>Operação de Inserção</h1>
                    <legend>
                        1. Os valores são sugeridos para um aprendizado claro e sem complicações.
                        <br>
                        2. Preencha todos os campos antes de apertar o botão "Inserir Produto"
                        <br>
                        3. Os valores ficarão visíveis e destacados na cor <mark class="create">verde</mark> no painel de visualização após a inserção
                    </legend>
                </div>

                <div class="form-main">
                    <div class="form-group">
                        <label for="product-code">Insira o código de produto</label>
                        <input type="text" id="product-code" name="product-code" inputmode="numeric" minlength="13" maxlength="13" placeholder="Sugestão: 1234567890123" required>
                    </div>

                    <div class="form-group">
                        <label for="product-name">Insira o nome</label>
                        <input type="text" id="product-name" name="product-name" placeholder="Sugestão: Computador ou Notebook" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-category">Selecione a categoria</label>
                        <select id="product-category" name="product-category" required>
                            <option value="">Sugestão: Eletrônicos</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Roupas">Roupas</option>
                            <option value="Livros">Livros</option>
                            <option value="Casa">Casa</option>
                            <option value="Esportes">Esportes</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-price">Insira o preço</label>
                        <input type="number" id="product-price" name="product-price" step="0.01" min="1" placeholder="Sugestão: 4987,99" required>
                    </div>
                    
                    <button class="form-button" type="submit">Inserir Produto</button>
                </div>
            </form>`
    ;
}

function loadReadForm() {
    return `<form>
                <div class="form-header">
                    <h1>Operação de Consulta</h1>
                    <legend>
                        1. Os valores são sugeridos para um aprendizado claro e sem complicações.
                        <br>
                        2. Preencha todos os campos antes de apertar o botão "Consultar Produto"
                        <br>
                        3. Os valores ficarão destacados na cor <mark class="read">verde claro</mark> no painel de visualização após a consulta
                    </legend>
                </div>

                <div class="form-main">
                    <div class="form-group">
                        <label for="product-code">Insira o código de produto</label>
                        <input type="text" id="product-code" name="product-code" inputmode="numeric" minlength="13" maxlength="13" placeholder="Sugestão: 1234567890123" required>
                    </div>
                    
                    <button class="form-button" type="submit">Consultar Produto</button>
                </div>
            </form>`
    ;
}

function loadUpdateQueryForm() {
    return `<form>
                <div class="form-header">
                    <h1>Operação de Alteração</h1>
                    <legend>
                        1. Os valores são sugeridos para um aprendizado claro e sem complicações.
                        <br>
                        2. Preencha todos os campos antes de apertar o botão "Consultar Produto para Alteração"
                        <br>
                        3. Os valores ficarão destacados na cor <mark class="read">verde claro</mark> no painel de visualização após a consulta
                    </legend>
                </div>

                <div class="form-main">
                    <div class="form-group">
                        <label for="product-code">Insira o código de produto</label>
                        <input type="text" id="product-code" name="product-code" inputmode="numeric" minlength="13" maxlength="13" placeholder="Sugestão: 1234567890123" required>
                    </div>
                    
                    <button class="form-button" type="submit">Consultar Produto para Alteração</button>
                </div>
            </form>`
    ;
}

function loadUpdateForm(foundProduct) {
    return `<form>
                <div class="form-header">
                    <h1>Operação de Alteração</h1>
                    <legend>
                        1. Os valores são sugeridos para um aprendizado claro e sem complicações.
                        <br>
                        2. Preencha todos os campos antes de apertar o botão "Alterar Produto"
                        <br>
                        3. Os valores ficarão visíveis e destacados na cor <mark class="update">laranja</mark> no painel de visualização após a alteração
                    </legend>
                </div>

                <div class="form-main">
                    <div class="form-group">
                        <label for="product-code">Insira o código de produto. Sugestão: 1234567890456</label>
                        <input type="text" id="product-code" name="product-code" inputmode="numeric" value="${foundProduct.code}" minlength="13" maxlength="13" required>
                    </div>

                    <div class="form-group">
                        <label for="product-name">Insira o nome. Sugestão: Montando um Computador ou Desmontando um Notebook</label>
                        <input type="text" id="product-name" name="product-name" value="${foundProduct.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-category">Selecione a categoria</label>
                        <select id="product-category" name="product-category" required>
                            <option value="${foundProduct.category}">Sugestão: Livros</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Roupas">Roupas</option>
                            <option value="Livros">Livros</option>
                            <option value="Casa">Casa</option>
                            <option value="Esportes">Esportes</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-price">Insira o preço. Sugestão: 49,99</label>
                        <input type="number" id="product-price" name="product-price" value="${foundProduct.price}" step="0.01" min="1" required>
                    </div>
                    
                    <button class="form-button" type="submit">Alterar Produto</button>
                </div>
            </form>`
    ;
}

function loadDeleteForm() {
    return `<form>
                <div class="form-header">
                    <h1>Operação de Exclusão</h1>
                    <legend>
                        1. Os valores são sugeridos para um aprendizado claro e sem complicações.
                        <br>
                        2. Preencha todos os campos antes de apertar o botão "Consultar Produto para Exclusão"
                        <br>
                        3. Os valores ficarão destacados na cor <mark class="read">verde claro</mark> no painel de visualização após a consulta
                    </legend>
                </div>

                <div class="form-main">
                    <div class="form-group">
                        <label for="product-code">Insira o código de produto</label>
                        <input type="text" id="product-code" name="product-code" inputmode="numeric" minlength="13" maxlength="13" placeholder="Sugestão: 1234567890456" required>
                    </div>
                    
                    <button class="form-button" type="submit">Consultar Produto para Exclusão</button>
                </div>
            </form>`
    ;
}

function DAO(data, operation, oldData = null) {
    panelInformation.index = null;
    panelInformation.operation = null;

    switch (operation) {
        case 'create':
            let newProduct = buildProduct(data);

            try {
                let newProductInBytes = convertToBytesFromProduct(newProduct);
                let newProductInHex = convertToHex(newProductInBytes);
                
                let newProductLengthBytes = intToBytes(newProductInBytes.join('').length);
                let newProductLengthHex = bytesToHex(newProductLengthBytes);

                newProductInHex.splice(1, 0, newProductLengthHex);
                products.push(newProductInHex);

                panelInformation.index = products.length - 1;
                panelInformation.operation = 'created';

                newProductInBytes = convertToBytesFromHex(newProductInHex);

                localStorage.setItem("lastId", JSON.stringify(lastId));
                localStorage.setItem("products.db", JSON.stringify(products));

                container.innerHTML = `<div class="result">
                                            <h1 class="result-title">Resultado da Operação de Inserção</h1>
                                            <h3 class="result-response">Produto "${newProduct.name}" inserido com sucesso</h3>
                                            <img src="./assets/256x256/database_check.png" alt="Ícone de sucesso">
                                            <h3 class="result-response">Agora, recomendamos que você clique no botão de Consulta<br>mas se preferir</h3>
                                            <button class="repeat-button">Inserir outro produto</button>
                                        </div>`
                ;
            } 
            catch (e) {
                container.innerHTML = `<div class="result">
                                            <h1 class="result-title">Resultado da Operação de Inserção</h1>
                                            <h3 class="result-response">Não foi possível inserir o Produto "${newProduct.name}"<br>ERRO: ${e}!</h3>
                                            <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                            <button class="repeat-button">Tentar novamente</button>
                                        </div>`
                ;
            }
            break;
        case 'read':
            if (products.length > 0) {
                let foundProduct = findProductByCode(data.get('product-code'));

                if (foundProduct) {
                    container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Consulta</h1>
                                                <h3 class="result-response">Produto com o código informado encontrado com sucesso</h3>
                                                <ul class="response-attrs">
                                                    <li class="response-attr">
                                                        Código: <span class="response-attr-value">${foundProduct.code}</span>
                                                    </li>
                                                    <li class="response-attr">
                                                        Nome: <span class="response-attr-value">${foundProduct.name}</span>
                                                    </li>
                                                    <li class="response-attr">
                                                        Categoria: <span class="response-attr-value">${foundProduct.category}</span>
                                                    </li>
                                                    <li class="response-attr">
                                                        Preço: <span class="response-attr-value">R$ ${foundProduct.price}</span>
                                                    </li>
                                                </ul>
                                                <h3 class="result-response">Agora, recomendamos que você clique no botão de Alteração<br>mas se preferir</h3>
                                                <button class="repeat-button">Consultar outro produto</button>
                                            </div>`
                    ;
                } else {
                    container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Consulta</h1>
                                                <h3 class="result-response">Não foi possível encontrar o Produto de código "${data.get('product-code')}"<br>O produto pode ter sido excluído, alterado ou não foi inserido!</h3>
                                                <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                <button class="repeat-button">Tentar novamente</button>
                                            </div>`
                    ;
                }
            }
            else {
                container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Consulta</h1>
                                                <h3 class="result-response">Não foi possível encontrar o Produto de código "${data.get('product-code')}"<br>Não existe nenhum produto no banco de dados!</h3>
                                                <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                <button class="repeat-button">Tentar novamente</button>
                                            </div>`
                ;
            }
            break;
        case 'updateQuery':
            if (products.length > 0) {
                let foundProduct = findProductByCode(data.get('product-code'));

                if (foundProduct) {
                    loadOperationForm('update', foundProduct);
                } 
                else {
                    container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Alteração</h1>
                                                <h3 class="result-response">Não foi possível encontrar o Produto de código "${data.get('product-code')}"<br>O produto pode ter sido excluído, alterado ou não foi inserido!</h3>
                                                <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                <button class="repeat-button">Tentar novamente</button>
                                            </div>`
                    ;
                }
            }
            else {
                container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Alteração</h1>
                                                <h3 class="result-response">Não foi possível encontrar o Produto de código "${data.get('product-code')}"<br>Não existe nenhum produto no banco de dados!</h3>
                                                <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                <button class="repeat-button">Tentar novamente</button>
                                            </div>`
                ;
            }
            break;
        case 'update':
            try {
                let updatedProduct = buildProduct(data);
                let updatedProductInBytes = convertToBytesFromProduct(updatedProduct);
                let updatedProductInHex = convertToHex(updatedProductInBytes);

                let updatedProductLengthBytes = intToBytes(updatedProductInBytes.join('').length);
                let updatedProductLengthHex = bytesToHex(updatedProductLengthBytes);

                updatedProductInHex.splice(1, 0, updatedProductLengthHex);

                for (let i = 0; i < products.length; i++) {
                    let productInBytes = convertToBytesFromHex(products[i]);
                    let product = convertToProduct(productInBytes);

                    if (product.code === oldData.code && product.tombstone === false) {
                        if (compareProductsLength(updatedProductInHex, products[i]) <= 0) {
                            updatedProduct.id = product.id;
                            updatedProductInBytes = convertToBytesFromProduct(updatedProduct);
                            updatedProductInHex = convertToHex(updatedProductInBytes);

                            updatedProductLengthBytes = intToBytes(updatedProductInBytes.join('').length);
                            updatedProductLengthHex = bytesToHex(updatedProductLengthBytes);

                            updatedProductInHex.splice(1, 0, updatedProductLengthHex);

                            lastId--;

                            products[i] = updatedProductInHex;
                            panelInformation.index = i;
                            panelInformation.operation = 'updated';
                            break;
                        }
                        else {
                            product.tombstone = true;

                            productInBytes = convertToBytesFromProduct(product);
                            let productInHex = convertToHex(productInBytes);

                            let productLengthBytes = intToBytes(productInBytes.join('').length);
                            let productLengthHex = bytesToHex(productLengthBytes);

                            productInHex.splice(1, 0, productLengthHex);

                            products[i] = productInHex;
                            
                            products.push(updatedProductInHex);
                            panelInformation.index = products.length - 1;
                            panelInformation.operation = 'updated';
                            break;
                        }
                    }
                }

                localStorage.setItem("lastId", JSON.stringify(lastId));
                localStorage.setItem("products.db", JSON.stringify(products));
                
                container.innerHTML = `<div class="result">
                                            <h1 class="result-title">Resultado da Operação de Alteração</h1>
                                            <h3 class="result-response">Produto alterado com sucesso</h3>
                                            <img src="./assets/256x256/database_check.png" alt="Ícone de sucesso">
                                            <h3 class="result-response">Agora, recomendamos que você clique no botão de Exclusão<br>mas se preferir</h3>
                                            <button class="repeat-button">Alterar outro produto</button>
                                        </div>`
                ;
            }
            catch (e) {
                container.innerHTML = `<div class="result">
                                            <h1 class="result-title">Resultado da Operação de Alteração</h1>
                                            <h3 class="result-response">Não foi possível alterar o Produto<br>ERRO: ${e}!</h3>
                                            <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                            <button class="repeat-button">Tentar novamente</button>
                                        </div>`
                ;
            }

            operation = "updateQuery";
            break;
        case 'delete':
            if (products.length > 0) {
                let foundProduct = findProductByCode(data.get('product-code'));

                if (foundProduct && foundProduct.tombstone === false) {
                    container.innerHTML = `<div class="result">
                                                <div class="form-header">
                                                    <h1 class="result-title">Resultado da Operação de Exclusão</h1>

                                                    <legend>
                                                        1. Os valores são sugeridos para um aprendizado claro e sem complicações.
                                                        <br>
                                                        2. Os valores ficarão destacados na cor <mark class="delete">vermelha</mark> no painel de visualização após a exclusão
                                                    </legend>
                                                </div>
                                                <h3 class="result-response">Produto com o código informado encontrado com sucesso</h3>
                                                <ul class="response-attrs">
                                                    <li class="response-attr">
                                                        Código: <span class="response-attr-value">${foundProduct.code}</span>
                                                    </li>
                                                    <li class="response-attr">
                                                        Nome: <span class="response-attr-value">${foundProduct.name}</span>
                                                    </li>
                                                    <li class="response-attr">
                                                        Categoria: <span class="response-attr-value">${foundProduct.category}</span>
                                                    </li>
                                                    <li class="response-attr">
                                                        Preço: <span class="response-attr-value">R$ ${foundProduct.price}</span>
                                                    </li>
                                                </ul>
                                                <h3 class="result-response">Deseja realmente excluir?</h3>
                                                <div class="delete-buttons">
                                                    <button class="delete-button-cancel">Cancelar</button>
                                                    <button class="delete-button-confirm">Excluir</button>
                                                </div>
                                            </div>`
                    ;

                    const deleteButtonCancel = document.querySelector('.delete-button-cancel');
                    const deleteButtonConfirm = document.querySelector('.delete-button-confirm');
                    
                    deleteButtonCancel.addEventListener('click', () => {
                        loadOperationForm('delete');
                    });

                    deleteButtonConfirm.addEventListener('click', () => {
                        try {
                            for (let i = 0; i < products.length; i++) {
                                let productInBytes = convertToBytesFromHex(products[i]);
                                let product = convertToProduct(productInBytes);

                                if (product.code === data.get('product-code') && product.tombstone === false) {
                                    product.tombstone = true;

                                    productInBytes = convertToBytesFromProduct(product);
                                    let productInHex = convertToHex(productInBytes);

                                    let productLengthBytes = intToBytes(productInBytes.join('').length);
                                    let productLengthHex = bytesToHex(productLengthBytes);

                                    productInHex.splice(1, 0, productLengthHex);

                                    products[i] = productInHex;

                                    panelInformation.index = i;
                                    panelInformation.operation = 'deleted';

                                    i = products.length;
                                }
                            }

                            localStorage.setItem("products.db", JSON.stringify(products));

                            container.innerHTML = `<div class="result">
                                                        <h1 class="result-title">Resultado da Operação de Exclusão</h1>
                                                        <h3 class="result-response">Produto excluído com sucesso</h3>
                                                        <img src="./assets/256x256/database_check.png" alt="Ícone de sucesso">
                                                        <h3 class="result-response">Agora, recomendamos que você clique no botão de Consulta<br>mas se preferir</h3>
                                                        <button class="repeat-button">Excluir outro produto</button>
                                                    </div>`
                            ;
                        }
                        catch (e) {
                            container.innerHTML = `<div class="result">
                                                        <h1 class="result-title">Resultado da Operação de Exclusão</h1>
                                                        <h3 class="result-response">Não foi possível excluir o Produto "Nome do produto"<br>ERRO: ${e}!</h3>
                                                        <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                        <button class="repeat-button">Tentar novamente</button>
                                                    </div>`
                            ;
                        }

                        repeatButton = document.querySelector('.repeat-button');
                        buildPanel();

                        if (repeatButton) {
                            repeatButton.addEventListener('click', () => {
                                loadOperationForm(operation);
                            });
                        }
                    });
                }
                else {
                    container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Exclusão</h1>
                                                <h3 class="result-response">Não foi possível encontrar o Produto de código "${data.get('product-code')}"<br>O produto pode ter sido excluído, alterado ou não foi inserido!</h3>
                                                <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                <button class="repeat-button">Tentar novamente</button>
                                            </div>`
                    ;
                }
            }
            else {
                container.innerHTML = `<div class="result">
                                                <h1 class="result-title">Resultado da Operação de Exclusão</h1>
                                                <h3 class="result-response">Não foi possível encontrar o Produto de código "${data.get('product-code')}"<br>Não existe nenhum produto no banco de dados!</h3>
                                                <img src="./assets/256x256/database_failed.png" alt="Ícone de fracasso">
                                                <button class="repeat-button">Tentar novamente</button>
                                            </div>`
                ;
            }
            break;
    }

    repeatButton = document.querySelector('.repeat-button');
    buildPanel();

    if (repeatButton) {
        repeatButton.addEventListener('click', () => {
            loadOperationForm(operation);
        });
    }
}

function buildProduct(data) {
    const price = data.get('product-price').replace(',', '.');

    return {
        tombstone: false,
        id: ++lastId,
        code: data.get('product-code'),
        name: data.get('product-name'),
        category: data.get('product-category'),
        price: parseFloat(price)
    };
}

function findProductByCode(code) {
    for (let i = 0; i < products.length; i++) {
        let productBytes = convertToBytesFromHex(products[i]);
        let product = convertToProduct(productBytes);

        if (product.code === code && product.tombstone === false) {
            panelInformation.index = i;
            panelInformation.operation = 'read';
            return product;
        }
    }

    return null;
}

function convertToBytesFromProduct(product) {
    let bytes = [];

    bytes.push(booleanToBytes(product.tombstone));
    bytes.push(intToBytes(product.id));
    bytes.push(stringToBytes(product.code));
    bytes.push(stringToBytes(product.name));
    bytes.push(stringToBytes(product.category));
    bytes.push(floatToBytes(product.price));

    return bytes;
}

function convertToHex(bytes) {
    let hexValues = [];

    hexValues.push(bytesToHex(bytes[0]));
    hexValues.push(bytesToHex(bytes[1]));
    hexValues.push(bytesToHex(bytes[2]));
    hexValues.push(bytesToHex(bytes[3]));
    hexValues.push(bytesToHex(bytes[4]));
    hexValues.push(bytesToHex(bytes[5]));

    return hexValues;
}

function convertToBytesFromHex(hexValues) {
    let bytes = [];

    bytes.push(hexToBytes(hexValues[0]));
    bytes.push(hexToBytes(hexValues[1]));
    bytes.push(hexToBytes(hexValues[2]));
    bytes.push(hexToBytes(hexValues[3]));
    bytes.push(hexToBytes(hexValues[4]));
    bytes.push(hexToBytes(hexValues[5]));
    bytes.push(hexToBytes(hexValues[6]));

    return bytes;
}

function convertToProduct(bytes) {
    return {
        tombstone: bytesToBoolean(bytes[0]),
        id: bytesToInt(bytes[2]),
        code: bytesToString(bytes[3]),
        name: bytesToString(bytes[4]),
        category: bytesToString(bytes[5]),
        price: bytesToFloat(bytes[6]).toFixed(2)
    };
}

function stringToBytes(value) {
    return new TextEncoder().encode(value);
}

function bytesToString(value) {
    return new TextDecoder().decode(value);
}

function booleanToBytes(value) {
    return new Uint8Array([value ? 1 : 0]); 
}

function bytesToBoolean(value) {
    return value == 0 ? false : true;
}

function intToBytes(value) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, value, false);

    return new Uint8Array(buffer);
}

function bytesToInt(value) {
    const view = new DataView(value.buffer, value.byteOffset, 4);

    return view.getUint32(0, false);
}

function floatToBytes(value) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, value);

    return new Uint8Array(buffer);
}

function bytesToFloat(value) {
    const view = new DataView(value.buffer);

    return view.getFloat32(0, false);
}

function bytesToHex(value) {
    return Array.from(value).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

function hexToBytes(hex) {
    let cleanHex = hex.replace(/[^0-9a-f]/gi, '');

    if (cleanHex.length % 2 !== 0) {throw new Error('String hexadecimal deve ter comprimento par');}
    
    let bytes = new Uint8Array(cleanHex.length / 2);

    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }

    return bytes;
}

function compareProductsLength(productA, productB) {
    let productALength = bytesToInt(hexToBytes(productA[1]));
    let productBLength = bytesToInt(hexToBytes(productB[1]));

    if (productALength < productBLength) return -1;
    if (productALength > productBLength) return 1;

    return 0;
}

function buildTableHead(screenWidth) {
    let numEmptySpace = 3;
    let length = 0;
    let tableHead = `<tr class="row">`;

    if (screenWidth < 413) length = 8;
    else length = 16;

    for (let i = 0; i < numEmptySpace; i++) tableHead += `<th></th>`;

    for (let i = 0; i < length; i++) tableHead += `<th>${i.toString(16).toUpperCase().padStart(2, '0')}</th>`;

    tableHead += `</tr>`;

    return tableHead;
}

function buildTableMain(screenWidth, productIndex, operation) {
    let cellStopped = 0; // 4 bytes é o tamanho do lastId
    let address = 0; // Endereço do inicio de cada linha
    let numEmptySpace = 2; // Número de células vazias
    let length = 0; // Quantidade de células por linha
    let tableRows = 0; // Número de linhas na tabela
    let tableBody = `<tr class="row" id="${tableRows}">`; // Inicia a primeira linha

    // Determina a quantidade de células por linha pelo tamanho da tela
    if (screenWidth < 413) length = 8;
    else length = 16;

    // Endereço da primeira linha em hexadecimal: 00000000
    tableBody += `<td class="address">${address.toString(16).toUpperCase().padStart(8, '0')}</td>`;

    // Add as células vazias
    for (let i = 0; i < numEmptySpace; i++) tableBody += `<td class="value"></td>`;

    // Converte o lastId para hexadecimal
    let lastIdBytes = intToBytes(lastId);
    let lastIdHex = bytesToHex(lastIdBytes).toUpperCase().split(' ');

    // Escreve o lastId na tabela
    for (let i = 0; i < lastIdHex.length; i++) {
        tableBody += `<td class="value">${lastIdHex[i].toUpperCase()}</td>`
        cellStopped++;
    }

    // Incrementa o endereço com 4 bytes
    address += cellStopped;

    // Loop que itera pelos produtos
    for (let i = 0; i < products.length; i++) {
        let productInHex = products[i].join(' ').split(' '); // Separa os pares hexadecimais para iterar

        // Loop que itera por cada par hexadecimal do produto da posição i
        for (let j = 0; j < productInHex.length; j++, address++) {
            // Verifica se alcançou o final da linha
            if (cellStopped % length === 0 && cellStopped !== 0) {
                cellStopped = 0; // Zera o valor da variável que aponta para a célula atual

                // Add o botão de olho no final da linha
                tableBody += `<td class="value button ${tableRows++}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye encode"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off decode hidden"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            </td>`
                ;
                tableBody += `</tr>`; // Fecha linha
                tableBody += `<tr class="row" id="${tableRows}">`; // Cria nova linha
                tableBody += `<td class="address">${address.toString(16).toUpperCase().padStart(8, '0')}</td>`; // Insere o endereço atualizado para a nova linha

                // Add células vazias
                for (let k = 0; k < numEmptySpace; k++) tableBody += `<td class="value"></td>`;
            }

            // Verifica se a célula faz parte de um registro que foi usado na última operação
            if (productIndex != null && productIndex === i) {
                tableBody += `<td class="value information ${operation}">${productInHex[j].toUpperCase()}</td>`;
            }
            else {
                // Verifica se a célula faz parte de um registro excluído
                if (productInHex[0] == 1) tableBody += `<td class="value information deleted">${productInHex[j].toUpperCase()}</td>`;
                else tableBody += `<td class="value information">${productInHex[j].toUpperCase()}</td>`;
            }
            cellStopped++;
        }
    }

    // Completa a última linha com células vazias, se necessário
    for (let i = cellStopped; i < length; i++) {
        tableBody += `<td class="value"></td>`;
    }

    // Add o botão de olho no final da última linha
    tableBody += `<td class="value button ${tableRows}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye encode"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off decode hidden"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </td>`
    ;
    
    tableBody += `</tr>`; // Fecha a última linha

    return tableBody;
}

function buildPanel() {
    const screenWidth = window.innerWidth;

    if (products.length == 0) {
        panel.innerHTML = `<div class="empty">
                                <h1>Painel de visualização</h1>
                                <span>Nenhum arquivo para exibir</span>
                            </div>`
        ;
    }
    else {
        panel.innerHTML = `<header>
                                <h2>Produtos.db</h2>
                                <span>Visualização do arquivo em 
                                    <a href="https://pt.wikipedia.org/wiki/Sistema_de_numera%C3%A7%C3%A3o_hexadecimal" 
                                    title="Informações sobre o sistema numérico hexadecimal" target="_blank">hexadecimal</a>
                                </span>
                            </header>
                            <table>
                                <thead>
                                    ${buildTableHead(screenWidth)}
                                </thead>
                                <tbody>
                                    ${buildTableMain(screenWidth, panelInformation.index, panelInformation.operation)}
                                </tbody>
                            </table>`
        ;

        eyeButtons = document.querySelectorAll(".button");

        eyeButtons.forEach(eyeButton => {
            eyeButton.addEventListener('click', () => {
                let svgsButton = eyeButton.querySelectorAll("svg");
                let action;

                svgsButton.forEach(svgButton => {
                    if (!svgButton.classList.contains("hidden")) svgButton.classList.add("hidden");
                    else {
                        svgButton.classList.remove("hidden");
                        action = svgButton.classList[2];
                    }
                })
                
                let line = document.getElementById(`${eyeButton.classList[2]}`);
                let informations = line.querySelectorAll(".information");
                lineInformation = [];

                if (action === 'decode') {
                    informations.forEach(information => {
                        lineInformation.push(information.textContent);
                        linesInformation[eyeButton.classList[2]] = lineInformation;

                        let informationInBytes = hexToBytes(information.textContent);
                        let informationString = bytesToString(informationInBytes);
                        information.textContent = (isSpecialChar(informationString) || informationString.length === 0) ? ".." : informationString.concat("     ");
                    });
                }
                else if (action === 'encode') {
                    lineInformation = linesInformation[eyeButton.classList[2]];

                    informations.forEach(information => {
                        information.textContent = lineInformation.shift();
                    });
                }
            })
        })
    }
}

function isSpecialChar(char) {
    if (char.length === 0) return false;
    
    const regex = /[^\p{L}\p{N}\s]/u;
    return regex.test(char);
}

window.addEventListener('load', () => {
    lastId = JSON.parse(localStorage.getItem("lastId")) || 0;
    products = JSON.parse(localStorage.getItem("products.db")) || [];

    buildPanel();
});