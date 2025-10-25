document.addEventListener('DOMContentLoaded', () => {
  
    const tituloModal = document.querySelector('.title');
    const gameArea = document.querySelector('.game-area');
    const colunaEsquerda = document.querySelector('.coluna-esquerda');

    // --- SETUP DOS CANVAS ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const characterCanvas = document.createElement('canvas');
    const characterCtx = characterCanvas.getContext('2d');

    // --- IMAGENS ---
    const playerImage = new Image();
    playerImage.src = 'https://uploads.onecompiler.io/43s2hj2ds/43zmzq89t/Personagem2%20ofc.png';
    
    const floorImage = new Image();
    floorImage.src = 'https://uploads.onecompiler.io/43s2hj2ds/43zmzq89t/Mapa.png';

    const foregroundImage = new Image();
    foregroundImage.src = 'https://uploads.onecompiler.io/43s2hj2ds/43zmzq89t/Estantes%20gotb.png';
    
    const CamadaImage = new Image();
    CamadaImage.src = 'https://uploads.onecompiler.io/43s2hj2ds/43zmzq89t/CamadaObjeto.png';
    
    const ObjImage = new Image();
    ObjImage.src = 'https://uploads.onecompiler.io/43s2hj2ds/43zmzq89t/Livros%20obj%20GOTB1.png';
    
    const MagoImage = new Image();
    MagoImage.src = 'https://uploads.onecompiler.io/43s2hj2ds/43zmzq89t/mago%20gotb.png';
    
    // --- OBJETOS DO JOGO ---
    const player = {
        x: 500,
        y: 400, // Posição inicial visível
        width: 24,
        height: 44,
        speed: 2,
        spriteWidth: 45,
        spriteHeight: 64,
        tiltAngle: 0
    };
    
    let AJUSTE_X = 10.5; // Nosso controle para o eixo X
    let AJUSTE_Y = 75;  // Nosso controle para o eixo Y
    
    characterCanvas.width = player.spriteWidth * 2;
    characterCanvas.height = player.spriteHeight * 2;

    const LivroSec = { x: 170, y: 300, width: 5, height: 5, color: 'gold' };
    
    const obstaculos = [
        // Estante inferior esquerda
        { x: 0, y: 500, width: 225, height: 80 },
        
        //Estante inferior direita
        { x: 615, y: 500, width: 290, height: 80 },
        // Mini estante
        { x: 900, y: 530, width: 110, height: 40 },
        
        // Estante superior esquerda
        { x: 0, y: 15, width: 465, height: 85 },
        
        // Relogio
        { x: 540, y: 55, width: 60, height: 40 },
        
        // Estante superior direita
        { x: 705, y: 15, width: 600, height: 80 },
        
        // Estante meio
        { x: 0, y: 295, width: 400, height: 40 },
        
        // Mini estante meio
        { x: 705, y: 190, width: 405, height: 40 },
        
        // Mesa
        { x: 615, y: 365, width: 380, height: 40 },
        
        // Mago
        { x: 650, y: 40, width: 40, height: 90 },
        
         // paredes
        { x: 0, y: 0, width: 15, height: 1000 }, // Esquerda
        { x: 1260, y: 0, width: 15, height: 1000 }, // Direita
        { x: 0, y: 0, width: 2000, height: 20 }, // Cima
        { x: 0, y: 710, width: 2000, height: 15 }, // Baixo
    ];

    // --- VARIÁVEIS DE ESTADO DO JOGO ---
    let isPlayerNear = false;
    let animationFrameId = null;
    let isMoving = false;
    let gameFrame = 0;
    let minigameCompleto = false;

    const keys = {
        'ArrowRight': false, 'ArrowLeft': false, 'ArrowUp': false, 'ArrowDown': false,
        'w': false, 'a': false, 's': false, 'd': false
    };
    
    function drawObstacles() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Vermelho para os obstáculos
    for (const obstaculo of obstaculos) {
        ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
    }
  }
  
    function drawPlayerCollisionBox() {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.6)'; // Verde para a hitbox do jogador
      // Desenha a caixa usando as coordenadas lógicas do jogador
      ctx.fillRect(player.x, player.y, player.width, player.height);
  }
    
    // --- FUNÇÕES DE DESENHO ---
    function drawCharacterOnBuffer() {
        characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
        characterCtx.save();
        const pivotX = characterCanvas.width / 2;
        const pivotY = characterCanvas.height - 10; 
        characterCtx.translate(pivotX, pivotY);
        characterCtx.rotate(player.tiltAngle);
        characterCtx.translate(-pivotX, -pivotY);
        characterCtx.drawImage(
            playerImage,
            (characterCanvas.width - player.spriteWidth) / 2,
            (characterCanvas.height - player.spriteHeight) - 10,
            player.spriteWidth,
            player.spriteHeight
        );
        characterCtx.restore();
    }

    // --- LÓGICA DE ATUALIZAÇÃO ---
    function update() {
        let moveX = 0;
        let moveY = 0;
        
        if (keys['ArrowRight'] || keys['d']) { moveX = 1; } 
        else if (keys['ArrowLeft'] || keys['a']) { moveX = -1; }
        if (keys['ArrowDown'] || keys['s']) { moveY = 1; } 
        else if (keys['ArrowUp'] || keys['w']) { moveY = -1; }
    
        isMoving = moveX !== 0 || moveY !== 0;
    
        if (isMoving) {
            let nextX = player.x, nextY = player.y;
            if (moveX !== 0 && moveY !== 0) {
                nextX += moveX * player.speed * 0.707;
                nextY += moveY * player.speed * 0.707;
            } else {
                nextX += moveX * player.speed;
                nextY += moveY * player.speed;
            }
            
            let canMove = true;
            const playerCollisionRect = { x: nextX, y: nextY, width: player.width, height: player.height };
            for (const obstaculo of obstaculos) {
                if (
                    playerCollisionRect.x < obstaculo.x + obstaculo.width &&
                    playerCollisionRect.x + playerCollisionRect.width > obstaculo.x &&
                    playerCollisionRect.y < obstaculo.y + obstaculo.height &&
                    playerCollisionRect.y + playerCollisionRect.height > obstaculo.y
                ) {
                    canMove = false;
                    break;
                }
            }
    
            if (canMove) {
                player.x = nextX;
                player.y = nextY;
            }
            player.tiltAngle = 0.15 * Math.sin(gameFrame * 0.35);
        } else {
            player.tiltAngle = 0;
        }
        gameFrame++;
        
        const dx = (player.x + player.width / 2) - (LivroSec.x + LivroSec.width / 2);
        const dy = (player.y + player.height / 2) - (LivroSec.y + LivroSec.height / 2);
        isPlayerNear = Math.sqrt(dx * dx + dy * dy) < 60;
    }
    
    // --- FUNÇÃO PRINCIPAL DE DESENHO ---
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. DESENHA O FUNDO E ELEMENTOS BASE
    if (floorImage.complete) ctx.drawImage(floorImage, 0, 0, canvas.width, canvas.height);
    if (foregroundImage.complete) ctx.drawImage(foregroundImage, 0, 0, canvas.width, canvas.height);
    if (MagoImage.complete) ctx.drawImage(MagoImage, 0, 0, canvas.width, canvas.height);

    // 2. DESENHA OS OBJETOS QUE FICAM ATRÁS DO PERSONAGEM
    if (ObjImage.complete) ctx.drawImage(ObjImage, 0, 0, canvas.width, canvas.height);
    
    // 3. DESENHA O PERSONAGEM
    drawCharacterOnBuffer();
    ctx.drawImage(
        characterCanvas,
        player.x - AJUSTE_X - (player.spriteWidth / 2),
        player.y - AJUSTE_Y
    );
    
    if (CamadaImage.complete) ctx.drawImage(CamadaImage, 0, 0, canvas.width, canvas.height);

    // drawObstacles();
    // drawPlayerCollisionBox();
    
    if (isPlayerNear) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 5;
        ctx.fillText("Pressione 'E' para interagir", canvas.width / 2, 50);
        ctx.shadowBlur = 0;
    }
}

    // --- LOOP E INÍCIO DO JOGO ---
    function gameLoop() {
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    let imagesLoaded = 0;
    const totalImages = 6;
    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          sortearLivro();
            gameLoop();
        }
    }
    floorImage.onload = imageLoaded;
    foregroundImage.onload = imageLoaded;
    playerImage.onload = imageLoaded;
    CamadaImage.onload = imageLoaded;
    ObjImage.onload = imageLoaded;
    MagoImage.onload = imageLoaded;

    // --- CONTROLES DE TECLADO ---
document.addEventListener('keydown', (event) => {
    // Definimos a tecla aqui para ser usada em toda a função
    const key = event.key;

    // Se o modal NÃO estiver visível, controla o personagem e a abertura do modal
    if (!modal.classList.contains('modal-visivel')) {

        // Lógica para registrar quais teclas de movimento estão pressionadas
        if (keys.hasOwnProperty(key.toLowerCase())) {
            keys[key.toLowerCase()] = true;
        } else if (keys.hasOwnProperty(key)) {
            keys[key] = true;
        }

        // Verifica se é para interagir com o Livrodle
       if (key.toLowerCase() === 'e' && isPlayerNear) {
        modal.classList.add('modal-visivel');
        stopGameLoop();

        // --- NOVA LÓGICA CONDICIONAL ---
        if (minigameCompleto) {
            // Se o jogo já foi ganho, exibe o estado de vitória imediatamente.
            exibirEstadoVitoria();
        } else {
            // Se não, inicia um novo jogo.
            iniciarJogoLivrodle();
            input.focus();
        }
        
        event.preventDefault(); 
    }

    // Se o modal JÁ ESTIVER visível, controla o Enter e o Escape
    } else {
        if (key === 'Escape') {
            fecharModal();
        }
        if (key === 'Enter' && document.activeElement === input) {
            processarPalpite();
        }
    }
});

    document.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (keys.hasOwnProperty(event.key) || keys.hasOwnProperty(key)) {
            keys[event.key] = false;
            keys[key] = false;
        }
    });

    // --- LÓGICA DO MINIGAME LIVRODLE ---
    const biblioteca = [
        { nome: "Dom Casmurro", genero: "Romance", ano: 1899, paginas: 256, ambientacao: "Brasil, século XIX", idioma: "Português" },
        { nome: "1984", genero: "Distopia", ano: 1949, paginas: 328, ambientacao: "Futuro totalitário", idioma: "Inglês" },
        { nome: "O Senhor dos Anéis", genero: "Fantasia", ano: 1954, paginas: 1200, ambientacao: "Terra-média", idioma: "Inglês" },
        { nome: "A Revolução dos Bichos", genero: "Sátira", ano: 1945, paginas: 144, ambientacao: "Fazenda na Inglaterra", idioma: "Inglês" },
        { nome: "Memórias Póstumas de Brás Cubas", genero: "Romance", ano: 1881, paginas: 224, ambientacao: "Brasil, século XIX", idioma: "Português" },
        { nome: "O Guia do Mochileiro das Galáxias", genero: "Ficção Científica", ano: 1979, paginas: 208, ambientacao: "Espaço", idioma: "Inglês" },
        { nome: "Orgulho e Preconceito", genero: "Romance", ano: 1813, paginas: 432, ambientacao: "Inglaterra, século XIX", idioma: "Inglês" },
        { nome: "Fahrenheit 451", genero: "Distopia", ano: 1953, paginas: 256, ambientacao: "Futuro distópico", idioma: "Inglês" },
        { nome: "Cem Anos de Solidão", genero: "Realismo Mágico", ano: 1967, paginas: 417, ambientacao: "Macondo", idioma: "Espanhol" },
        { nome: "Grande Sertão: Veredas", genero: "Modernismo", ano: 1956, paginas: 608, ambientacao: "Sertão brasileiro", idioma: "Português" },
    ];
    let livroSecreto = null;
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('livrodle-modal');
    const input = document.getElementById("adv-input");
    const sugestoesDiv = document.getElementById("sugestoes-livros");
    const guessButton = document.getElementById("adv-btao");
    const registroPalpites = document.getElementById("registro-palpites");
    const notificador = document.getElementById("notificador");

    function stopGameLoop() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }
    function fecharModal() {
        modal.classList.remove('modal-visivel');
        gameLoop();
    }
    
    function iniciarJogoLivrodle() {
    if (minigameCompleto) return; 

    if (registroPalpites) registroPalpites.innerHTML = "";
    if (input) {
        input.value = "";
        input.disabled = false;
    }
    if (sugestoesDiv) sugestoesDiv.innerHTML = "";

    tituloModal.textContent = "???";
    colunaEsquerda.classList.remove('fade-out'); 
    
    if (guessButton) {
        guessButton.disabled = false;
        guessButton.textContent = "Adivinhar";
        guessButton.onclick = processarPalpite;
    }
  }

    function sortearLivro() {
        const indiceAleatorio = Math.floor(Math.random() * biblioteca.length);
        livroSecreto = biblioteca[indiceAleatorio];
        
        console.log("O livro secreto sorteado é:", livroSecreto.nome);
    }
    
      function exibirEstadoVitoria() {
        tituloModal.textContent = livroSecreto.nome;
        colunaEsquerda.classList.add('fade-out'); 
        input.disabled = true;
        guessButton.disabled = true;
        guessButton.textContent = "Concluído";
    }

    function mostrarNotificacao(mensagem, tipo = 'erro') {
        notificador.textContent = mensagem;
        notificador.className = tipo === 'vitoria' ? 'vitoria' : '';
        notificador.style.display = 'block';
        setTimeout(() => { notificador.style.display = 'none'; }, 3000);
    }

    function processarPalpite() {
        const tentativa = input.value.trim();
        const livroPalpite = biblioteca.find(livro => livro.nome.toLowerCase() === tentativa.toLowerCase());
        if (!livroPalpite) {
            return;
        }
        const linhaRegistro = document.createElement("div");
        linhaRegistro.classList.add("linha-registro");
        const campos = ['nome', 'genero', 'ano', 'paginas', 'ambientacao', 'idioma'];
        const labels = { nome: 'Nome', genero: 'Gênero', ano: 'Ano', paginas: 'Páginas', ambientacao: 'Ambientação', idioma: 'Idioma' };
        campos.forEach(campo => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-registro');
            itemDiv.dataset.label = labels[campo] + ':';
            let conteudo = livroPalpite[campo];
            if (livroPalpite[campo] === livroSecreto[campo]) {
                itemDiv.classList.add('correto');
            } else {
                itemDiv.classList.add('incorreto');
                if (campo === 'ano' || campo === 'paginas') {
                    const seta = livroPalpite[campo] < livroSecreto[campo] ? '↑' : '↓';
                    conteudo = `${conteudo} ${seta}`;
                }
            }
            itemDiv.textContent = conteudo;
            linhaRegistro.appendChild(itemDiv);
        });
        registroPalpites.appendChild(linhaRegistro);
        input.value = "";
        if (livroPalpite.nome === livroSecreto.nome) {
            mostrarNotificacao("🎉 Parabéns! Você acertou! 🎉", "vitoria");
           
        minigameCompleto = true; 

        tituloModal.textContent = livroSecreto.nome;

        linhaRegistro.classList.add('vitoria-final');

        colunaEsquerda.classList.add('fade-out');
   
        input.disabled = true;
        guessButton.disabled = true;
      }
    }

    if (input) {
        input.addEventListener("input", () => {
            const valor = input.value.toLowerCase();
            if (valor === "") {
                sugestoesDiv.innerHTML = "";
                return;
            }
            const sugestoesFiltradas = biblioteca.filter(livro => livro.nome.toLowerCase().includes(valor));
            sugestoesDiv.innerHTML = "";
            sugestoesFiltradas.forEach(livro => {
                const sugestao = document.createElement("div");
                sugestao.classList.add("sugestao-item");
                sugestao.textContent = livro.nome;
                sugestao.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    input.value = livro.nome;
                    sugestoesDiv.innerHTML = "";
                    input.focus();
                });
                sugestoesDiv.appendChild(sugestao);
            });
        });
        input.addEventListener("blur", () => {
            setTimeout(() => { if (!sugestoesDiv.contains(document.activeElement)) { sugestoesDiv.innerHTML = ""; } }, 150);
        });
    }

    if (guessButton) guessButton.addEventListener('click', processarPalpite);
    if (closeModalBtn) closeModalBtn.addEventListener('click', fecharModal);

});
