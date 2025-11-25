// --- EFEITO DE DIGITAÇÃO DO MASCOTE ---
const robotMsgs = [
  "Olá, humano! 👋 Sou o R-42, seu guia na Missão IA!",
  "Vamos testar seus conhecimentos sobre o universo da IA.",
  "Prepare-se para começar as missões! 🚀",
];

let msgIndex = 0;
let charIndex = 0;
const robotTextElement = document.getElementById("robot-text");
let typewriterTimeout; // Para controlar o loop do typewriter

function typeWriter() {
  clearTimeout(typewriterTimeout);
  if (robotTextElement && msgIndex < robotMsgs.length) {
    let currentMsg = robotMsgs[msgIndex];
    if (charIndex < currentMsg.length) {
      robotTextElement.innerHTML += currentMsg.charAt(charIndex);
      charIndex++;
      typewriterTimeout = setTimeout(typeWriter, 30);
    } else {
      typewriterTimeout = setTimeout(() => {
        msgIndex = (msgIndex + 1) % robotMsgs.length;
        charIndex = 0;
        robotTextElement.innerHTML = "";
        typeWriter();
      }, 2500);
    }
  }
}

// --- LÓGICA DO JOGO ---
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

const gameContainer = document.getElementById("game-container");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

const resultContainerElement = document.getElementById("result-container");
const resultTitleElement = resultContainerElement.querySelector("h3");
const resultTextElement = resultContainerElement.querySelector("p");

const progressBarContainer = document.getElementById("progress-bar-container");
const progressBar = document.getElementById("progress-bar");

let shuffledQuestions, currentQuestionIndex;
let score = 0;

const questions = [
  {
    question: "Você pede para uma IA criar a imagem de um 'cientista famoso'. Se ela só mostra homens brancos, isso significa que a IA pode ser...?",
    answers: [
      { text: "Perfeita", correct: false },
      { text: "Viciada ou tendenciosa", correct: true },
      { text: "Sempre neutra", correct: false },
    ],
    explanation: "Sim, uma IA pode ser tendenciosa (ter um 'viés'). Ela aprende com dados da internet, que muitas vezes refletem preconceitos do mundo real. É nosso papel questionar isso!"
  },
  {
    question: "Você encontra um aplicativo que usa IA para identificar plantas e animais por uma foto. Como essa tecnologia pode ajudar o meio ambiente?",
    answers: [
      { text: "Apenas para fazer posts bonitos nas redes sociais.", correct: false },
      { text: "Ajudando cientistas a monitorar a biodiversidade e proteger espécies.", correct: true },
      { text: "Substituindo biólogos para que não precisem mais ir a campo.", correct: false },
    ],
    explanation: "Isso mesmo! Ferramentas de IA ajudam cientistas a coletar e analisar dados em grande escala, acelerando a descoberta de novas espécies e a proteção de ecossistemas. É a tecnologia a serviço da natureza!"
  },
  {
    question: "Você usa uma IA para te ajudar no dever de casa. Qual é a maneira mais inteligente de usar a resposta dela?",
    answers: [
      { text: "Copiar e colar para terminar rápido", correct: false },
      { text: "Usar como base para entender e escrever com minhas palavras", correct: true },
      { text: "Nem ler a resposta", correct: false },
    ],
    explanation: "Correto! A IA deve ser uma ferramenta de aprendizado, não uma máquina de fazer o trabalho por você. Usá-la para entender o assunto é o que te torna mais inteligente."
  },
  {
    question: "Qual tipo de informação é segura para dar a um chatbot de IA com quem você conversa?",
    answers: [
      { text: "Seu nome completo e onde você estuda", correct: false },
      { text: "Uma senha secreta sua", correct: false },
      { text: "Seus gostos, como 'gosto de pizza'", correct: true },
    ],
    explanation: "Isso mesmo! Nunca compartilhe dados pessoais ou senhas. Falar sobre gostos gerais é seguro, mas trate a IA como um estranho na internet: com cuidado."
  },
  {
    question: "Se você usa uma IA para gerar uma melodia para sua música, de quem é a obra final?",
    answers: [
      { text: "Totalmente da IA", correct: false },
      { text: "É uma colaboração! Sua ideia guiou a IA.", correct: true },
      { text: "De ninguém", correct: false },
    ],
    explanation: "É uma parceria! Você teve a ideia, deu os comandos e usou a ferramenta para criar algo novo. A criatividade principal ainda é sua."
  },
    {
    question: "Uma IA pode realmente 'sentir' felicidade ou tristeza?",
    answers: [
      { text: "Sim, elas são muito avançadas", correct: false },
      { text: "Não, elas podem simular emoções, mas não as sentem de verdade.", correct: true },
    ],
    explanation: "Exato. IAs são excelentes em reconhecer e reproduzir padrões de texto e imagem que parecem emoções, mas elas não têm consciência ou sentimentos reais."
  },
  {
    question: "Por que apps de IA gratuitos, como filtros de rosto, existem?",
    answers: [
      { text: "Porque os criadores são muito generosos", correct: false },
      { text: "Geralmente, eles usam nossos dados para treinar a IA ou para publicidade", correct: true },
    ],
    explanation: "Na internet, quando um produto é de graça, muitas vezes o 'produto' é você (ou seus dados). As empresas usam essas informações para melhorar seus serviços ou vender anúncios."
  },
  {
    question: "O que é mais importante ao usar uma IA como o ChatGPT?",
    answers: [
      { text: "Acreditar em tudo que ele diz", correct: false },
      { text: "Fazer a pergunta certa e checar as informações", correct: true },
      { text: "Usar as frases mais longas possíveis", correct: false },
    ],
    explanation: "A habilidade mais importante é saber perguntar (o 'prompt') e ter pensamento crítico para avaliar e verificar as respostas. A IA é uma copiloto, mas o piloto é você."
  },
  {
    question: "Se uma IA te desse um conselho para fazer algo perigoso ou errado, o que você faria?",
    answers: [
      { text: "Seguiria, pois a IA é mais inteligente", correct: false },
      { text: "Ignoraria o conselho e, se possível, avisaria um adulto", correct: true },
      { text: "Pediria para ela um conselho diferente", correct: false },
    ],
    explanation: "Perfeito. Seu bom senso e segurança são mais importantes que qualquer sugestão de uma máquina. Nunca faça algo que pareça errado ou perigoso."
  },
  {
    question: "O futuro da IA será definido por...",
    answers: [
      { text: "Apenas por grandes empresas de tecnologia", correct: false },
      { text: "Pela própria IA, que vai decidir tudo sozinha", correct: false },
      { text: "Por todos nós, através de como escolhemos usar e regular essa tecnologia", correct: true },
    ],
    explanation: "Exato! Todos nós, como usuários e cidadãos, temos um papel em moldar um futuro onde a IA seja usada de forma ética e para o bem."
  },
];

function startGame() {
  clearTimeout(typewriterTimeout); // Para o robô
  
  startButton.classList.add("hidden");
  gameContainer.querySelector("p").classList.add("hidden");
  progressBarContainer.classList.remove("hidden");
  
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  resultContainerElement.classList.add("hidden");
  questionContainerElement.classList.remove("hidden");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  updateProgressBar();
  if (currentQuestionIndex < questions.length) {
    showQuestion(shuffledQuestions[currentQuestionIndex]);
  } else {
    showResult();
  }
}

function showQuestion(questionData) {
  questionElement.innerText = `Missão ${currentQuestionIndex + 1}: ${questionData.question}`;
  robotTextElement.innerText = "Escolha uma das opções abaixo. 🤔";
  questionData.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.dataset.explanation = questionData.explanation;
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hidden");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";
  
  if(correct) {
      score++;
      robotTextElement.innerText = "Correto! ✅ Mandou bem!";
  } else {
      robotTextElement.innerText = "Ops! ❌ A resposta certa era outra.";
  }

  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
    button.removeEventListener('click', selectAnswer); // Impede duplo clique
  });
  
  const explanation = selectedButton.dataset.explanation;
  const explanationElement = document.createElement("p");
  explanationElement.innerText = explanation;
  explanationElement.classList.add("explanation-text", "fade-in");
  answerButtonsElement.appendChild(explanationElement);

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hidden");
  } else {
    setTimeout(showResult, 3000); // Atraso maior para ler a última explicação
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

function showResult() {
    questionContainerElement.classList.add("hidden");
    nextButton.classList.add("hidden");
    progressBarContainer.classList.add("hidden");

    let title, text;
    if(score >= 8) {
        title = "Parabéns, Mestre da IA! 🏆";
        text = `Você acertou ${score} de ${questions.length} missões e provou que sabe usar a IA com sabedoria e segurança.`;
        robotTextElement.innerText = "Uau! Você é um verdadeiro mestre da IA! 🤩";
    } else if (score >= 5) {
        title = "Bom trabalho, Herói Digital! ⚡";
        text = `Você acertou ${score} de ${questions.length} missões. Você está no caminho certo para dominar a IA.`;
        robotTextElement.innerText = "Belo trabalho! Continue aprendendo. 👍";
    } else {
        title = "Quase lá, Explorador! 🤖";
        text = `Você completou ${score} de ${questions.length} missões. Continue aprendendo e tente novamente para melhorar!`;
        robotTextElement.innerText = "Não desanime! O aprendizado é uma jornada. 💪";
    }
    
    resultTitleElement.innerText = title;
    resultTextElement.innerText = text;
    resultContainerElement.classList.remove("hidden");
    resultContainerElement.classList.add("fade-in");
    
    // Reinicia o typewriter do robô após um tempo
    setTimeout(() => {
        charIndex = 0;
        msgIndex = 0;
        typeWriter();
    }, 4000);
}

function updateProgressBar() {
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}


// Event Listeners
if(startButton) {
    startButton.addEventListener("click", startGame);
}

if(nextButton) {
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
}

if(restartButton) {
    restartButton.addEventListener("click", startGame);
}


// Inicia os scripts quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', (event) => {
    typeWriter();
});
