document.addEventListener('DOMContentLoaded', function() {
            
            // --- VARIÁVEIS GLOBAIS PRIMEIRO ---
            
            // --- Seletores de Tela ---
            const telaBiblioteca = document.getElementById('tela-biblioteca');
            const telaTutorial = document.getElementById('tela-tutorial');
            const telaDialogo = document.getElementById('tela-dialogo');
            const telaJogo = document.getElementById('tela-jogo');
            const modal = document.getElementById('livrodle-modal'); 
            
            // --- Botões ---
            const botaoJogar = document.getElementById('botao-jogar');
            const devButton = document.getElementById('dev-button');
            const startGameButton = document.getElementById('start-game-button');
            const closeModalBtn = document.getElementById('close-modal-btn'); 
            
            // --- Outros Elementos HTML ---
            const allDetails = document.querySelectorAll('.tome-details');
            const allTomes = document.querySelectorAll('.tome');
            const tituloModal = document.querySelector('.livrodle-content .title'); 
            const gameArea = document.querySelector('.game-area');
            const colunaEsquerda = document.querySelector('.coluna-esquerda');
            const input = document.getElementById("adv-input");
            const sugestoesDiv = document.getElementById("sugestoes-livros");
            const guessButton = document.getElementById("adv-btao");
            const registroPalpites = document.getElementById("registro-palpites");
            const notificador = document.getElementById("notificador");
            const canvas = document.getElementById('gameCanvas'); // Definido aqui
            
            // --- Variáveis de Estado do Jogo ---
            let livroProximo = null;
            let animationFrameId = null;
            let isMoving = false;
            let gameFrame = 0;
            let imagesLoaded = 0;
            const totalImages = 6;
            let gameStarted = false; 
            let livroSecreto = null; // Definido ao interagir com 'E'

            const keys = {
                'arrowright': false, 'arrowleft': false, 'arrowup': false, 'arrowdown': false,
                'w': false, 'a': false, 's': false, 'd': false
            };
            
            // --- Dicionário de Livros ---
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
                { nome: "O Pequeno Príncipe", genero: "Fábula", ano: 1943, paginas: 96, ambientacao: "Diversos planetas", idioma: "Francês" },
                { nome: "Moby Dick", genero: "Aventura", ano: 1851, paginas: 720, ambientacao: "Oceano Atlântico", idioma: "Inglês" },
                { nome: "Crime e Castigo", genero: "Romance Psicológico", ano: 1866, paginas: 671, ambientacao: "São Petersburgo", idioma: "Russo" },
                { nome: "O Apanhador no Campo de Centeio", genero: "Romance", ano: 1951, paginas: 277, ambientacao: "Nova York", idioma: "Inglês" },
                { nome: "Drácula", genero: "Terror", ano: 1897, paginas: 418, ambientacao: "Transilvânia e Londres", idioma: "Inglês" },
                { nome: "Frankenstein", genero: "Terror", ano: 1818, paginas: 280, ambientacao: "Europa", idioma: "Inglês" },
                { nome: "O Nome da Rosa", genero: "Mistério", ano: 1980, paginas: 512, ambientacao: "Mosteiro medieval", idioma: "Italiano" },
                { nome: "O Conde de Monte Cristo", genero: "Aventura", ano: 1844, paginas: 1276, ambientacao: "França, século XIX", idioma: "Francês" },
                { nome: "Os Miseráveis", genero: "Drama", ano: 1862, paginas: 1463, ambientacao: "França", idioma: "Francês" },
                { nome: "Jane Eyre", genero: "Romance", ano: 1847, paginas: 500, ambientacao: "Inglaterra vitoriana", idioma: "Inglês" },
                { nome: "O Morro dos Ventos Uivantes", genero: "Romance Gótico", ano: 1847, paginas: 416, ambientacao: "Yorkshire", idioma: "Inglês" },
                { nome: "O Velho e o Mar", genero: "Ficção", ano: 1952, paginas: 127, ambientacao: "Cuba", idioma: "Inglês" },
                { nome: "A Metamorfose", genero: "Ficção", ano: 1915, paginas: 100, ambientacao: "Cidade europeia indefinida", idioma: "Alemão" },
                { nome: "Ensaio sobre a Cegueira", genero: "Romance", ano: 1995, paginas: 312, ambientacao: "Cidade não identificada", idioma: "Português" },
                { nome: "O Alquimista", genero: "Ficção Filosófica", ano: 1988, paginas: 208, ambientacao: "Deserto do Saara", idioma: "Português" },
                { nome: "A Menina que Roubava Livros", genero: "Drama", ano: 2005, paginas: 480, ambientacao: "Alemanha nazista", idioma: "Inglês" },
                { nome: "O Código Da Vinci", genero: "Suspense", ano: 2003, paginas: 480, ambientacao: "Europa", idioma: "Inglês" },
                { nome: "A Cabana", genero: "Drama Espiritual", ano: 2007, paginas: 368, ambientacao: "Oregon", idioma: "Inglês" },
                { nome: "It: A Coisa", genero: "Terror", ano: 1986, paginas: 1104, ambientacao: "Derry, Maine", idioma: "Inglês" },
                { nome: "O Iluminado", genero: "Terror", ano: 1977, paginas: 447, ambientacao: "Hotel Overlook", idioma: "Inglês" },
                { nome: "Neuromancer", genero: "Cyberpunk", ano: 1984, paginas: 271, ambientacao: "Futuro distópico", idioma: "Inglês" },
                { nome: "Duna", genero: "Ficção Científica", ano: 1965, paginas: 688, ambientacao: "Planeta Arrakis", idioma: "Inglês" },
                { nome: "O Hobbit", genero: "Fantasia", ano: 1937, paginas: 310, ambientacao: "Terra-média", idioma: "Inglês" },
                { nome: "O Leão, a Feiticeira e o Guarda-Roupa", genero: "Fantasia", ano: 1950, paginas: 208, ambientacao: "Nárnia", idioma: "Inglês" },
                { nome: "As Crônicas de Nárnia", genero: "Fantasia", ano: 1956, paginas: 767, ambientacao: "Nárnia", idioma: "Inglês" },
                { nome: "Harry Potter e a Pedra Filosofal", genero: "Fantasia", ano: 1997, paginas: 223, ambientacao: "Hogwarts", idioma: "Inglês" },
                { nome: "Harry Potter e as Relíquias da Morte", genero: "Fantasia", ano: 2007, paginas: 607, ambientacao: "Hogwarts", idioma: "Inglês" },
                { nome: "Percy Jackson e o Ladrão de Raios", genero: "Fantasia", ano: 2005, paginas: 384, ambientacao: "Estados Unidos", idioma: "Inglês" },
                { nome: "Jogos Vorazes", genero: "Distopia", ano: 2008, paginas: 374, ambientacao: "Panem", idioma: "Inglês" },
                { nome: "Em Chamas", genero: "Distopia", ano: 2009, paginas: 400, ambientacao: "Panem", idioma: "Inglês" },
                { nome: "A Esperança", genero: "Distopia", ano: 2010, paginas: 424, ambientacao: "Panem", idioma: "Inglês" },
                { nome: "O Caçador de Pipas", genero: "Drama", ano: 2003, paginas: 372, ambientacao: "Afeganistão", idioma: "Inglês" },
                { nome: "Mil Sóis Resplandecentes", genero: "Drama", ano: 2007, paginas: 432, ambientacao: "Cabul", idioma: "Inglês" },
                { nome: "A Sombra do Vento", genero: "Mistério", ano: 2001, paginas: 565, ambientacao: "Barcelona", idioma: "Espanhol" },
                { nome: "O Jogo do Anjo", genero: "Mistério", ano: 2008, paginas: 672, ambientacao: "Barcelona", idioma: "Espanhol" },
                { nome: "Veronika Decide Morrer", genero: "Drama", ano: 1998, paginas: 224, ambientacao: "Eslovênia", idioma: "Português" },
                { nome: "Onze Minutos", genero: "Romance", ano: 2003, paginas: 288, ambientacao: "Genebra", idioma: "Português" },
                { nome: "O Diário de Anne Frank", genero: "Biografia", ano: 1947, paginas: 352, ambientacao: "Amsterdã", idioma: "Holandês" },
                { nome: "Admirável Mundo Novo", genero: "Distopia", ano: 1932, paginas: 311, ambientacao: "Futuro tecnocrático", idioma: "Inglês" },
                { nome: "O Processo", genero: "Romance", ano: 1925, paginas: 304, ambientacao: "Cidade indefinida", idioma: "Alemão" },
                { nome: "A Divina Comédia", genero: "Épico", ano: 1320, paginas: 798, ambientacao: "Inferno, Purgatório e Paraíso", idioma: "Italiano" },
                { nome: "Ilíada", genero: "Épico", ano: -750, paginas: 704, ambientacao: "Troia e Grécia antiga", idioma: "Grego" },
                { nome: "Odisseia", genero: "Épico", ano: -700, paginas: 600, ambientacao: "Mar Mediterrâneo", idioma: "Grego" },
                { nome: "Hamlet", genero: "Tragédia", ano: 1603, paginas: 400, ambientacao: "Dinamarca", idioma: "Inglês" },
                { nome: "Macbeth", genero: "Tragédia", ano: 1606, paginas: 272, ambientacao: "Escócia", idioma: "Inglês" },
                { nome: "Romeu e Julieta", genero: "Tragédia", ano: 1597, paginas: 200, ambientacao: "Verona", idioma: "Inglês" },
                { nome: "Dom Quixote", genero: "Sátira", ano: 1605, paginas: 1072, ambientacao: "Espanha", idioma: "Espanhol" },
                { nome: "O Estrangeiro", genero: "Filosófico", ano: 1942, paginas: 184, ambientacao: "Argélia", idioma: "Francês" },
                { nome: "A Peste", genero: "Filosófico", ano: 1947, paginas: 320, ambientacao: "Orã", idioma: "Francês" },
                { nome: "O Amor nos Tempos do Cólera", genero: "Romance", ano: 1985, paginas: 368, ambientacao: "Caribe colombiano", idioma: "Espanhol" },
                { nome: "O Som e a Fúria", genero: "Modernismo", ano: 1929, paginas: 326, ambientacao: "Sul dos EUA", idioma: "Inglês" },
                { nome: "Sobre a Brevidade da Vida", genero: "Filosofia", ano: 49, paginas: 120, ambientacao: "Roma Antiga", idioma: "Latim" },
                { nome: "O Príncipe", genero: "Política", ano: 1532, paginas: 140, ambientacao: "Itália renascentista", idioma: "Italiano" },
            ];

            // --- Objetos do Jogo (Canvas) ---
             const player = {
                x: 500, y: 400, width: 24, height: 44, speed: 2,
                spriteWidth: 45, spriteHeight: 64, tiltAngle: 0
            };
            let AJUSTE_X = 10.5;
            let AJUSTE_Y = 75;  
            const livrosInterativos = [
                { id: 'livro_1', x: 170, y: 300, width: 5, height: 5, livroSecreto: null, completo: false },
                { id: 'livro_2', x: 870, y: 190, width: 5, height: 10, livroSecreto: null, completo: false },
                { id: 'livro_3', x: 820, y: 60, width: 5, height: 5, livroSecreto: null, completo: false },
                { id: 'livro_4', x: 960, y: 400, width: 5, height: 5, livroSecreto: null, completo: false },
                { id: 'livro_5', x: 650, y: 380, width: 5, height: 5, livroSecreto: null, completo: false },
                { id: 'livro_6', x: 950, y: 540, width: 5, height: 5, livroSecreto: null, completo: false }
            ];
             const obstaculos = [
                { x: 0, y: 500, width: 225, height: 80 }, { x: 615, y: 500, width: 290, height: 80 },
                { x: 900, y: 530, width: 110, height: 40 }, { x: 0, y: 15, width: 465, height: 85 },
                { x: 540, y: 55, width: 60, height: 40 }, { x: 705, y: 15, width: 600, height: 80 },
                { x: 0, y: 295, width: 400, height: 40 }, { x: 705, y: 190, width: 405, height: 40 },
                { x: 615, y: 365, width: 380, height: 40 }, { x: 650, y: 40, width: 40, height: 90 },
                { x: 0, y: 0, width: 15, height: 1000 }, { x: 1260, y: 0, width: 15, height: 1000 }, 
                { x: 0, y: 0, width: 2000, height: 20 }, { x: 0, y: 710, width: 2000, height: 15 }
            ];

            // --- SETUP DOS CANVAS --- (Agora dentro do DOMContentLoaded)
            let ctx, characterCanvas, characterCtx; // Declarar aqui
            if (canvas) {
                 ctx = canvas.getContext('2d');
                 characterCanvas = document.createElement('canvas');
                 characterCtx = characterCanvas.getContext('2d');
                 characterCanvas.width = player.spriteWidth * 2;
                 characterCanvas.height = player.spriteHeight * 2;
            } else {
                 console.error("Elemento canvas 'gameCanvas' não encontrado!");
                 // Considerar parar a execução ou mostrar um erro para o usuário
            }

            // --- IMAGENS --- (Definições movidas para cá)
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


             // --- DEFINIÇÃO DAS FUNÇÕES ---
            
            // Função para fechar o diálogo e ir para o canvas
            function endDialogueAndStartTutorial() {
                if(telaDialogo) telaDialogo.style.display = 'none';
                if(telaDialogo) telaDialogo.classList.remove('ativa'); 
                if(telaTutorial) telaTutorial.style.display = 'flex'; // Mostra o tutorial
                // Não mostra telaJogo ainda
            }
             
            // --- Funções de Desenho e Jogo ---
             function drawObstacles() {
                 if(!ctx) return;
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; 
                for (const obstaculo of obstaculos) {
                    ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
                }
            }
            
            function drawPlayerCollisionBox() {
                if(!ctx) return;
                ctx.fillStyle = 'rgba(0, 255, 0, 0.6)'; 
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
            
            function drawInteractiveBookHitboxes() {
                if(!ctx) return;
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; 
                for (const livro of livrosInterativos) {
                    ctx.fillRect(livro.x, livro.y, livro.width, livro.height);
                }
            }
            
            function drawCharacterOnBuffer() {
                 if(!characterCtx) return;
                characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
                characterCtx.save();
                const pivotX = characterCanvas.width / 2;
                const pivotY = characterCanvas.height - 10; 
                characterCtx.translate(pivotX, pivotY);
                characterCtx.rotate(player.tiltAngle);
                characterCtx.translate(-pivotX, -pivotY);
                if (playerImage.complete) { // Verifica se a imagem carregou
                     characterCtx.drawImage(
                         playerImage,
                         (characterCanvas.width - player.spriteWidth) / 2,
                         (characterCanvas.height - player.spriteHeight) - 10,
                         player.spriteWidth,
                         player.spriteHeight
                     );
                }
                characterCtx.restore();
            }

            function update() {
                 // ... (lógica de movimento e colisão como antes) ...
                let moveX = 0;
                let moveY = 0;
                
                if (keys['arrowright'] || keys['d']) { moveX = 1; } 
                else if (keys['arrowleft'] || keys['a']) { moveX = -1; }
                if (keys['arrowdown'] || keys['s']) { moveY = 1; } 
                else if (keys['arrowup'] || keys['w']) { moveY = -1; }
            
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
                
                let livroEncontrado = null;
                for (const livro of livrosInterativos) {
                    const dx = (player.x + player.width / 2) - (livro.x + livro.width / 2);
                    const dy = (player.y + player.height / 2) - (livro.y + livro.height / 2);
                    const distancia = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distancia < 60) { 
                        livroEncontrado = livro;
                        break; 
                    }
                }
                livroProximo = livroEncontrado;
            }
            
            function draw() {
                 if(!ctx || !canvas) return; // Verifica se o contexto existe
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (floorImage.complete) ctx.drawImage(floorImage, 0, 0, canvas.width, canvas.height);
                if (foregroundImage.complete) ctx.drawImage(foregroundImage, 0, 0, canvas.width, canvas.height);
                if (MagoImage.complete) ctx.drawImage(MagoImage, 0, 0, canvas.width, canvas.height);
                if (ObjImage.complete) ctx.drawImage(ObjImage, 0, 0, canvas.width, canvas.height);
                
                drawCharacterOnBuffer(); // Chama a função que desenha no buffer
                 if (characterCanvas) { // Verifica se characterCanvas foi criado
                      ctx.drawImage(
                           characterCanvas, // Usa o canvas buffer
                           player.x - AJUSTE_X - (player.spriteWidth / 2),
                           player.y - AJUSTE_Y
                      );
                 }
                
                if (CamadaImage.complete) ctx.drawImage(CamadaImage, 0, 0, canvas.width, canvas.height);

                // drawObstacles();
                // drawPlayerCollisionBox();
                // drawInteractiveBookHitboxes();
                
                if (livroProximo && !livroProximo.completo) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.font = 'bold 20px Arial';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 5;
                    ctx.fillText("Pressione 'E' para interagir", canvas.width / 2, 50);
                    ctx.shadowBlur = 0;
                }
            }

            function gameLoop() {
                update();
                draw();
                animationFrameId = requestAnimationFrame(gameLoop);
            }

             function stopGameLoop() {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
             
             // --- Funções do Modal e Livrodle ---
            function fecharModal() {
                 if(modal) modal.classList.remove('modal-visivel');
                if (!animationFrameId && imagesLoaded === totalImages) {
                    if (!gameStarted) {
                        gameStarted = true; 
                    }
                    gameLoop();
                }
            }
            
            function iniciarJogoLivrodle() {
                if (registroPalpites) registroPalpites.innerHTML = "";
                if (input) {
                    input.value = "";
                    input.disabled = false;
                }
                if (sugestoesDiv) sugestoesDiv.innerHTML = "";

                if (tituloModal) tituloModal.textContent = "???"; 
                if(colunaEsquerda) colunaEsquerda.classList.remove('fade-out'); 
                if(gameArea) gameArea.classList.remove('fade-out'); 
                
                if (guessButton) {
                    guessButton.disabled = false;
                    guessButton.textContent = "Adivinhar";
                    guessButton.onclick = processarPalpite; 
                }
            }

            function associarLivrosSecretos() {
                let livrosDisponiveis = [...biblioteca];
                livrosDisponiveis.sort(() => Math.random() - 0.5);

                for (const livroInterativo of livrosInterativos) {
                    if (livrosDisponiveis.length > 0) {
                        livroInterativo.livroSecreto = livrosDisponiveis.pop();
                    } else {
                        console.error("Acabaram os livros da biblioteca!");
                        break;
                    }
                }
                console.log("Livros associados:", livrosInterativos);
            }
            
            function exibirEstadoVitoria() {
                if (livroProximo && livroProximo.livroSecreto) { 
                    if(tituloModal) tituloModal.textContent = livroProximo.livroSecreto.nome;
                }
                if(colunaEsquerda) colunaEsquerda.classList.add('fade-out'); 
                if(gameArea) gameArea.classList.add('fade-out'); 
                if (input) input.disabled = true;
                if (guessButton) {
                    guessButton.disabled = true;
                    guessButton.textContent = "Concluído";
                    guessButton.onclick = null; 
                }
                if (registroPalpites) registroPalpites.innerHTML = ""; 
                mostrarNotificacao("Você já encontrou este livro!", "vitoria");
            }

            function mostrarNotificacao(mensagem, tipo = 'erro') {
                 if (!notificador) return; 
                notificador.textContent = mensagem;
                notificador.className = ''; // Limpa classes anteriores
                if (tipo === 'vitoria') {
                     notificador.classList.add('vitoria');
                }
                notificador.style.display = 'block';
                setTimeout(() => { 
                    if(notificador) notificador.style.display = 'none'; 
                }, 3000);
            }

            function processarPalpite() {
                 if (!input || !livroProximo || !livroProximo.livroSecreto || !registroPalpites) return; 

                const tentativa = input.value.trim();
                const livroPalpite = biblioteca.find(livro => livro.nome.toLowerCase() === tentativa.toLowerCase());

                if (!livroPalpite) {
                    mostrarNotificacao("Livro não encontrado na biblioteca.");
                    return;
                }

                const linhaRegistro = document.createElement("div");
                linhaRegistro.classList.add("linha-registro");

                const campos = ['nome', 'genero', 'ano', 'paginas', 'ambientacao', 'idioma'];
                const labels = { nome: 'Nome', genero: 'Gênero', ano: 'Ano', paginas: 'Páginas', ambientacao: 'Ambientação', idioma: 'Idioma' };
                
                const livroCorreto = livroProximo.livroSecreto; 

                campos.forEach(campo => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item-registro');
                    itemDiv.dataset.label = labels[campo] + ':';
                    
                    let conteudo = livroPalpite[campo];

                    if (livroPalpite[campo] === livroCorreto[campo]) {
                        itemDiv.classList.add('correto');
                    } else {
                        itemDiv.classList.add('incorreto');
                        if ((campo === 'ano' || campo === 'paginas') && typeof livroPalpite[campo] === 'number' && typeof livroCorreto[campo] === 'number') { 
                            const seta = livroPalpite[campo] < livroCorreto[campo] ? '↑' : '↓';
                            conteudo = `${conteudo} ${seta}`;
                        }
                    }
                    itemDiv.textContent = conteudo;
                    linhaRegistro.appendChild(itemDiv);
                });

                registroPalpites.appendChild(linhaRegistro);
                input.value = "";
                if(sugestoesDiv) sugestoesDiv.innerHTML = ""; 

                if (livroPalpite.nome === livroCorreto.nome) {
                    mostrarNotificacao("🎉 Parabéns! Você acertou! 🎉", "vitoria");
                    
                    livroProximo.completo = true; 
                    verificarTodosConcluidos();

                    if(tituloModal) tituloModal.textContent = livroCorreto.nome;

                    linhaRegistro.classList.add('vitoria-final');
                    if(colunaEsquerda) colunaEsquerda.classList.add('fade-out');
                
                    input.disabled = true;
                    if (guessButton) {
                         guessButton.disabled = true;
                         guessButton.onclick = null; 
                    }
                   
                }
            }
            
            function verificarTodosConcluidos() {
                const todosCompletos = livrosInterativos.every(livro => livro.completo);

                if (todosCompletos) {
                    console.log("PARABÉNS! Você completou todos os desafios dos livros!");
                    mostrarNotificacao("VOCÊ ENCONTROU TODOS OS LIVROS!", "vitoria");
                     // Adicionar lógica de final de jogo aqui
                }
            }

            // --- FUNÇÃO DE CARREGAMENTO DE IMAGEM --- (Agora definida antes de ser usada)
             function imageLoaded() {
                imagesLoaded++;
                if (imagesLoaded === totalImages) { // Removido !gameStarted para garantir associação
                    associarLivrosSecretos();
                    console.log("Imagens carregadas. Pronto para iniciar o jogo.");
                    // O loop inicia após o diálogo ou ao fechar o modal
                }
            }


             // --- ADIÇÃO DOS EVENT LISTENERS ---

             // --- Lógica de Transição de Tela ---
             if (botaoJogar) {
                botaoJogar.addEventListener('click', function(event) {
                    event.stopPropagation(); 
                    if(telaBiblioteca) telaBiblioteca.style.display = 'none';
                    if(telaDialogo) telaDialogo.style.display = 'flex';
                    
                    setTimeout(function() {
                        if(telaDialogo) telaDialogo.classList.add('ativa'); 
                    }, 10);
                    
                    // Chama a função que agora inicia o tutorial
                    setTimeout(function() {
                        endDialogueAndStartTutorial(); // Renomeado para clareza
                    }, 9000); 
                });
            }
            
            // NOVO: Listener para o botão Iniciar Jogo do Tutorial
            if (startGameButton) {
                startGameButton.addEventListener('click', function() {
                    if (telaTutorial) telaTutorial.style.display = 'none'; // Esconde o tutorial
                    if (telaJogo) telaJogo.style.display = 'flex'; // Mostra o jogo

                    // Inicia o jogo DEPOIS de fechar o tutorial
                    if (!animationFrameId && imagesLoaded === totalImages) {
                         if (!gameStarted) { gameStarted = true; }
                         gameLoop();
                     }
                });
            }
            
            // --- Lógica dos Balões (Tela Biblioteca) ---
            if (devButton) {
                devButton.addEventListener('click', function(event) {
                    event.stopPropagation(); 
                    const parentWrapper = this.parentElement;
                    if (!parentWrapper) return;
                    const details = parentWrapper.querySelector('.tome-details');
                    if (!details) return;
                    
                    const isAlreadyActive = details.classList.contains('active');

                    allDetails.forEach(d => d.classList.remove('active'));
                    allTomes.forEach(t => t.classList.remove('active'));

                    if (!isAlreadyActive) {
                        details.classList.add('active');
                        this.classList.add('active'); // 'this' se refere ao devButton
                    }
                });
            }

            if (telaBiblioteca) {
                telaBiblioteca.addEventListener('click', function() {
                    allDetails.forEach(d => d.classList.remove('active'));
                    allTomes.forEach(t => t.classList.remove('active'));
                });
            }

             // --- Controles de Teclado ---
            document.addEventListener('keydown', (event) => {
                const key = event.key.toLowerCase();
                 // Verifica se modal existe antes de acessar classList
                if (modal && modal.classList.contains('modal-visivel')) {
                    if (key === 'escape') {
                        fecharModal();
                    }
                    if (key === 'enter' && input && document.activeElement === input) {
                        processarPalpite();
                    }
                } 
                else { // Modal não está visível ou não existe
                    if (keys.hasOwnProperty(key)) {
                        keys[key] = true;
                    }
                    // Verifica se livroProximo existe antes de acessar propriedades
                    if (key === 'e' && livroProximo) { 
                        if (!livroProximo.completo) { 
                             if(modal) modal.classList.add('modal-visivel');
                            stopGameLoop();
                            livroSecreto = livroProximo.livroSecreto; 
                            iniciarJogoLivrodle();
                            event.preventDefault(); 
                        } else { // Livro já completo
                            if(modal) modal.classList.add('modal-visivel');
                            stopGameLoop();
                            exibirEstadoVitoria();
                            event.preventDefault();
                        }
                    }
                }
            });

            document.addEventListener('keyup', (event) => {
                const key = event.key.toLowerCase();
                if (keys.hasOwnProperty(key)) {
                    keys[key] = false;
                }
            });

             // --- Listeners do Modal Livrodle ---
             if (input) {
                input.addEventListener("input", () => {
                     if(!sugestoesDiv) return; 
                    const valor = input.value.toLowerCase();
                    if (valor === "") {
                        sugestoesDiv.innerHTML = ""; return;
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
                    if(sugestoesDiv) {
                        setTimeout(() => { if (!sugestoesDiv.contains(document.activeElement)) { sugestoesDiv.innerHTML = ""; } }, 150);
                    }
                });
            }
            if (guessButton) guessButton.addEventListener('click', processarPalpite);
            if (closeModalBtn) closeModalBtn.addEventListener('click', fecharModal);

            // --- Carregamento das Imagens --- (Listeners no final)
            floorImage.onload = imageLoaded;
            foregroundImage.onload = imageLoaded;
            playerImage.onload = imageLoaded;
            CamadaImage.onload = imageLoaded;
            ObjImage.onload = imageLoaded;
            MagoImage.onload = imageLoaded;
            
        });
