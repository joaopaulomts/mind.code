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
    question: "As IAs de conversa, como eu, são chamadas de LLMs. O que significa essa sigla?",
    answers: [
      { text: "Linguagem de Lógica Moderna", correct: false },
      { text: "Large Language Model (Modelo de Linguagem Grande)", correct: true },
      { text: "Lógica de Longo Módulo", correct: false },
    ],
    explanation: "Correto! 'Large Language Model' significa que fui treinado com uma quantidade gigantesca de textos e livros para entender e gerar linguagem humana."
  },
  {
    question: "Quando você me envia um 'prompt' (um comando ou pergunta), como eu crio a resposta?",
    answers: [
      { text: "Eu pesquiso a resposta exata na internet como um gênio.", correct: false },
      { text: "Eu entendo seus sentimentos para adivinhar a resposta.", correct: false },
      { text: "Eu prevejo a sequência de palavras mais provável para te responder.", correct: true },
    ],
    explanation: "Exato! Eu não 'sei' a resposta. Eu calculo as probabilidades para gerar uma frase que faça sentido a partir do seu prompt, baseado nos padrões que aprendi."
  },
  {
    question: "Se uma IA não tem consciência ou conhecimento próprio, por que às vezes ela parece 'inventar' informações que não são reais?",
    answers: [
      { text: "Porque ela está tentando te enganar.", correct: false },
      { text: "É uma 'alucinação', uma tentativa de preencher lacunas nos padrões que ela conhece.", correct: true },
      { text: "Significa que a IA ficou mais inteligente que os humanos.", correct: false },
    ],
    explanation: "Isso! Chamamos de 'alucinação'. A IA tenta continuar a sequência de texto de forma lógica, mas se não tem a informação correta, pode criar uma resposta que parece real, mas é falsa."
  },
  {
    question: "A qualidade das minhas respostas depende diretamente da qualidade dos dados com que fui treinado. O que isso significa?",
    answers: [
      { text: "Se os dados de treino forem ruins ou tendenciosos, minhas respostas também podem ser.", correct: true },
      { text: "Não importa, a IA sempre sabe corrigir os dados sozinha.", correct: false },
      { text: "Quanto mais dados, mais criativo eu fico, inventando coisas novas.", correct: false },
    ],
    explanation: "Perfeito! Esse é um ponto crucial. A IA reflete os dados que recebeu. Se os dados contêm preconceitos ou informações erradas, a IA pode replicar esses erros. Por isso, a curadoria dos dados é fundamental."
  },
  {
    question: "Qual a principal diferença entre a minha 'inteligência' e a de um ser humano?",
    answers: [
      { text: "Nenhuma, somos igualmente inteligentes.", correct: false },
      { text: "Eu sou melhor em criatividade e emoções.", correct: false },
      { text: "Humanos têm consciência, emoções e bom senso; eu sou um processador de padrões.", correct: true },
    ],
    explanation: "Exatamente! Enquanto eu posso processar informações muito rápido, eu não tenho consciência, sentimentos ou experiências de vida. A inteligência humana é muito mais complexa e completa."
  }
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
  questionElement.innerText = `Desafio ${currentQuestionIndex + 1}: ${questionData.question}`;
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
    if(score === 5) {
        title = "Parabéns, Mestre da IA! 🏆";
        text = `Você acertou ${score} de ${questions.length} desafios e provou que entende como a IA funciona!`;
        robotTextElement.innerText = "Uau! Você é um verdadeiro mestre da IA! 🤩";
    } else if (score >= 3) {
        title = "Bom trabalho, Herói Digital! ⚡";
        text = `Você acertou ${score} de ${questions.length} desafios. Você está no caminho certo para dominar a IA.`;
        robotTextElement.innerText = "Belo trabalho! Continue aprendendo. 👍";
    } else {
        title = "Quase lá, Explorador! 🤖";
        text = `Você completou ${score} de ${questions.length} desafios. Continue aprendendo e tente novamente para melhorar!`;
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
