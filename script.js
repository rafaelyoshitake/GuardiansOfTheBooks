 document.addEventListener('DOMContentLoaded', () => {

            // --- CONFIGURAÇÃO DO CANVAS E JOGADOR ---
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');

            const player = {
              x: 0,
              y: 0,
              width: 24,
              height: 40,
              color: '#3498db',
              speed: 2
            };

            const itemDourado = {
              x: 400,
              y: 250,
              width: 20,
              height: 35,
              color: 'gold'
            };

            let isPlayerNear = false;
            let animationFrameId = null;
            let stepCycle = 0;
            const stepCycleMax = 20;
            let isMoving = false;

            const keys = {
              ArrowRight: false,
              ArrowLeft: false,
              ArrowUp: false,
              ArrowDown: false,
              w: false,
              a: false,
              s: false,
              d: false
            };
            
            function drawPlayer() {
                ctx.save(); // Salva o estado atual do canvas

                // Define o ponto de pivô para a inclinação na base do personagem
                const pivotX = player.x + player.width / 2;
                const pivotY = player.y + player.height + 15; // Ajustado para a base

                // Calcula o ângulo de inclinação
                const tiltAngle = isMoving ? Math.sin(stepCycle * 0.4) * 0.1 : 0; 

                // Aplica a rotação
                ctx.translate(pivotX, pivotY);
                ctx.rotate(tiltAngle);
                ctx.translate(-pivotX, -pivotY);

                // Calças
                ctx.fillStyle = '#333'; // Cinza escuro/preto
                ctx.fillRect(player.x, player.y + player.height, player.width, 12);

                // Pés
                ctx.fillStyle = 'black';
                ctx.fillRect(player.x, player.y + player.height + 12, player.width, 6);

                // Casaco
                ctx.fillStyle = 'orange';
                ctx.fillRect(player.x, player.y + 10, player.width, player.height);

                // Cabeça
                ctx.fillStyle = '#F0C2A2'; // Cor de pele
                ctx.beginPath();
                ctx.arc(player.x + player.width / 2, player.y + player.height / 2.5, player.width * 0.9, 0, Math.PI * 2);
                ctx.fill();

                // Cabelo
                ctx.fillStyle = '#4a2e1d';
                ctx.beginPath();
                ctx.arc(player.x + player.width / 2, player.y + player.height / 2.5, player.width * 0.9, Math.PI, Math.PI * 2, false);
                ctx.fill();

                // Olhos
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(player.x + player.width / 2 - 6, player.y + player.height / 2.5, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(player.x + player.width / 2 + 6, player.y + player.height / 2.5, 4, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(player.x + player.width / 2 - 6, player.y + player.height / 2.5, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(player.x + player.width / 2 + 6, player.y + player.height / 2.5, 2, 0, Math.PI * 2);
                ctx.fill();

                // Mãos
                ctx.fillStyle = '#F0C2A2'; // Cor de pele
                ctx.beginPath();
                ctx.arc(player.x - 4, player.y + player.height, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(player.x + player.width + 4, player.y + player.height, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore(); // Restaura o estado do canvas
            }

            // --- Desenho do Livro ---
            function drawBook() {
                // Capa do livro
                ctx.fillStyle = '#8a6d3b';
                ctx.fillRect(itemDourado.x, itemDourado.y, itemDourado.width, itemDourado.height);
                // Lombada
                ctx.fillStyle = '#5c4033';
                ctx.fillRect(itemDourado.x, itemDourado.y, 5, itemDourado.height);
                // Páginas (lateral)
                ctx.fillStyle = '#fdf5e6';
                ctx.fillRect(itemDourado.x + 5, itemDourado.y + 2, itemDourado.width - 5, itemDourado.height - 4);
                // Detalhe na capa
                ctx.fillStyle = '#d4af37';
                ctx.beginPath();
                ctx.arc(itemDourado.x + itemDourado.width / 2 + 2, itemDourado.y + itemDourado.height / 2, 5, 0, Math.PI * 2);
                ctx.fill();
            }


            // --- CONFIGURAÇÃO DO JOGO LIVRODLE ---
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

            // Elementos do DOM do Modal
            const closeModalBtn = document.getElementById('close-modal-btn');
            const modal = document.getElementById('livrodle-modal');
            const input = document.getElementById("adv-input");
            const sugestoesDiv = document.getElementById("sugestoes-livros");
            const guessButton = document.getElementById("adv-btao");
            const registroPalpites = document.getElementById("registro-palpites");
            const notificador = document.getElementById("notificador");

           function update() {
                let moveX = 0;
                let moveY = 0;

                if (keys.ArrowRight || keys.d) moveX = 1;
                else if (keys.ArrowLeft || keys.a) moveX = -1;

                if (keys.ArrowDown || keys.s) moveY = 1;
                else if (keys.ArrowUp || keys.w) moveY = -1;

                isMoving = moveX !== 0 || moveY !== 0;

                if (isMoving) {
                    if (moveX !== 0 && moveY !== 0) {
                        player.x += moveX * player.speed * 0.707;
                        player.y += moveY * player.speed * 0.707;
                    } else {
                        player.x += moveX * player.speed;
                        player.y += moveY * player.speed;
                    }
                    stepCycle = (stepCycle + 1) % stepCycleMax;
                } else {
                    stepCycle = 0;
                }

              const playerTotalHeight = player.height + 18; // Altura ajustada
              const playerTotalWidth = player.width + 8; // Largura ajustada
          
              if (player.x > canvas.width - playerTotalWidth) {
                  player.x = canvas.width - playerTotalWidth;
              }
              if (player.x < -playerTotalWidth / 2) {
                  player.x = -playerTotalWidth / 2;
              }
              if (player.y > canvas.height - playerTotalHeight) {
                  player.y = canvas.height - playerTotalHeight;
              }
              if (player.y < 0) {
                  player.y = 0;
              }
  
              const dx = (player.x + player.width / 2) - (itemDourado.x + itemDourado.width / 2);
              const dy = (player.y + player.height / 2) - (itemDourado.y + itemDourado.height / 2);
              const distance = Math.sqrt(dx * dx + dy * dy);
              isPlayerNear = distance < 60;
          }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                drawBook();
                drawPlayer();
                
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

            function gameLoop() {
                update();
                draw();
                animationFrameId = requestAnimationFrame(gameLoop);
            }

            function stopGameLoop() {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            }
            
            function fecharModal() {
                modal.classList.remove('modal-visivel');
                gameLoop();
            }

            // --- FUNÇÕES DO LIVRODLE ---
            function iniciarJogoLivrodle() {
                sortearLivro();
                registroPalpites.innerHTML = "";
                input.value = "";
                sugestoesDiv.innerHTML = "";
                guessButton.disabled = false;
                guessButton.textContent = "Adivinhar";
                 // Remove o handler onclick de "jogar novamente" se existir
                guessButton.onclick = null;
            }

            function sortearLivro() {
                const indiceAleatorio = Math.floor(Math.random() * biblioteca.length);
                livroSecreto = biblioteca[indiceAleatorio];
                console.log("Livro secreto:", livroSecreto.nome);
            }

            function mostrarNotificacao(mensagem, tipo = 'erro') {
                notificador.textContent = mensagem;
                notificador.className = tipo === 'vitoria' ? 'vitoria' : '';
                notificador.style.display = 'block';
                setTimeout(() => { notificador.style.display = 'none'; }, 3000);
            }

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
            
            function processarPalpite() {
                const tentativa = input.value.trim();
                const livroPalpite = biblioteca.find(livro => livro.nome.toLowerCase() === tentativa.toLowerCase());

                if (!livroPalpite) {
                    mostrarNotificacao("Livro não encontrado na biblioteca!");
                    return;
                }
                
                const linhaRegistro = document.createElement("div");
                linhaRegistro.classList.add("linha-registro");

                const campos = ['nome', 'genero', 'ano', 'paginas', 'ambientacao', 'idioma'];
                const labels = { nome: 'Nome', genero: 'Gênero', ano: 'Ano', paginas: 'Páginas', ambientacao: 'Ambientação', idioma: 'Idioma'};

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
                    guessButton.disabled = true;
                    guessButton.textContent = "Jogar Novamente";
                    guessButton.onclick = iniciarJogoLivrodle;
                }
            }

            // --- CONTROLES GERAIS E EVENTOS ---
            document.addEventListener('keydown', (event) => {
                const key = event.key;
                const lowerKey = key.toLowerCase();
                
                if (!modal.classList.contains('modal-visivel')) {
                    if (lowerKey in keys) {
                        event.preventDefault();
                        keys[lowerKey] = true;
                    }
                    if (lowerKey === 'e' && isPlayerNear) {
                        modal.classList.add('modal-visivel');
                        stopGameLoop();
                        input.focus();
                        event.preventDefault();
                    }
                } else { // Se o modal está visível
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
                if (key in keys) {
                    keys[key] = false;
                }
            });
            
            guessButton.addEventListener('click', processarPalpite);
            closeModalBtn.addEventListener('click', fecharModal);

            iniciarJogoLivrodle();
            gameLoop();
        });
