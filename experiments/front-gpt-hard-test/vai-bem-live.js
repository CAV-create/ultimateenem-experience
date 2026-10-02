(() => {
  "use strict";

  const teachers = Object.freeze({
    math: {
      id: "math",
      track: "start",
      teacher: "Profa. Lia",
      avatar: "LI",
      subject: "Matemática",
      focus: "Frações, proporções e resolução guiada",
      grade: "6º ano do Ensino Fundamental",
      voice: "Aoede",
    },
    port: {
      id: "port",
      track: "rise",
      teacher: "Prof. André",
      avatar: "AN",
      subject: "Língua Portuguesa",
      focus: "Leitura, gramática e produção de texto",
      grade: "1º ano do Ensino Médio",
      voice: "Iapetus",
    },
    chem: {
      id: "chem",
      track: "rise",
      teacher: "Prof. Rafael",
      avatar: "RA",
      subject: "Química",
      focus: "Química orgânica e estequiometria",
      grade: "2º ano do Ensino Médio",
      voice: "Charon",
    },
  });

  const tracks = Object.freeze({
    start: {
      label: "VaiBem START",
      range: "3º ao 8º ano",
      description: "Explicações concretas, pistas visuais e passos curtos.",
    },
    rise: {
      label: "VaiBem RISE",
      range: "9º ano ao 2º ano do Ensino Médio",
      description: "Explicação guiada com autonomia crescente.",
    },
  });

  let context = null;
  let mode = "math";
  let ws = null;
  let stream = null;
  let inputCtx = null;
  let processor = null;
  let sourceNode = null;
  let zeroGain = null;
  let outputCtx = null;
  let audioNextTime = 0;
  let audioFirstTime = Infinity;
  let audioGeneration = 0;
  let muted = false;
  let connected = false;
  let setupReady = false;
  let micStarted = false;
  let suppressOutput = false;
  let activeAudioSources = [];
  let inputTranscript = "";
  let outputTranscript = "";
  let board = null;
  let startedAt = 0;

  const byId = (id) => document.getElementById(id);
  const teacher = () => teachers[mode] || teachers.math;
  const escape = (value) => context?.esc ? context.esc(value) : String(value || "");

  function ensureState(state) {
    state.vaibemTrack ||= "start";
    const available = Object.values(teachers).filter((item) => item.track === state.vaibemTrack);
    if (!teachers[state.vaibemTeacher] || teachers[state.vaibemTeacher].track !== state.vaibemTrack) {
      state.vaibemTeacher = available[0]?.id || "math";
    }
    state.vaibemLiveNotebooks ||= [];
    state.vaibemLiveNotebookId ||= "";
    return state;
  }

  function teacherOptions(state) {
    return Object.values(teachers)
      .filter((item) => item.track === state.vaibemTrack)
      .map((item) => `<button type="button" class="vb-teacher-option ${state.vaibemTeacher === item.id ? "selected" : ""}" data-vb-teacher="${item.id}" aria-pressed="${state.vaibemTeacher === item.id}"><span class="vb-avatar">${item.avatar}</span><span><strong>${item.teacher}</strong><small>${item.subject} · ${item.grade}</small></span><span aria-hidden="true">→</span></button>`)
      .join("");
  }

  function renderHome(ctx) {
    const state = ensureState(ctx.state);
    const activeTrack = tracks[state.vaibemTrack];
    const activeTeacher = teachers[state.vaibemTeacher];
    const sessions = state.vaibemLiveNotebooks.length;
    return ctx.shell(`<div class="home-intro"><div class="kicker">Aula particular VaiBem</div><h1>Converse. Veja. Faça junto.</h1><p>O professor escuta sua dúvida, explica em voz natural e constrói o quadro durante a conversa.</p></div>
      <section class="vb-home-band">
        <div class="vb-track-switch" role="group" aria-label="Escolha a etapa escolar">
          ${Object.entries(tracks).map(([key, item]) => `<button type="button" data-vb-track="${key}" class="${state.vaibemTrack === key ? "selected" : ""}" aria-pressed="${state.vaibemTrack === key}"><strong>${item.label.replace("VaiBem ", "")}</strong><small>${item.range}</small></button>`).join("")}
        </div>
        <div class="vb-home-copy"><span class="kicker">${activeTrack.label}</span><h2>${activeTrack.description}</h2><p>Escolha o professor e entre na sala. A conversa continua na mesma sessão; não é preciso reabrir o microfone a cada pergunta.</p></div>
        <div class="vb-teacher-list">${teacherOptions(state)}</div>
        <div class="vb-next-step"><div><span class="kicker">Seu próximo passo</span><strong>${activeTeacher.teacher} · ${activeTeacher.subject}</strong><small>${activeTeacher.focus}</small></div><button type="button" class="btn goldbtn" id="vb-enter-room">Entrar na aula →</button></div>
      </section>
      ${ctx.row("Meu caderno", `${sessions} ${sessions === 1 ? "aula salva" : "aulas salvas"} para retomar.`, "vaibem/caderno", "book")}
      ${ctx.row("O que estou aprendendo", "Evidências acumuladas e próxima explicação sugerida.", "vaibem/evolucao", "chart")}`, "hoje", "vaibem");
  }

  function renderRoom(ctx) {
    const state = ensureState(ctx.state);
    mode = state.vaibemTeacher;
    const item = teacher();
    const audit = new URLSearchParams(location.search).get("auditReview") === "1";
    return `<div class="vb-live-shell">
      <header class="vb-live-header"><button type="button" class="textbtn" id="vb-back-home">← Voltar</button><div><strong>VaiBem · AULA PARTICULAR</strong><small>${tracks[item.track].label} · ${item.subject}</small></div><span id="vb-live-state" class="vb-live-off">DESCONECTADO</span></header>
      <main class="vb-live-grid" id="main">
        <section class="vb-live-teacher" aria-label="Conversa com o professor virtual">
          <div class="vb-live-person"><span class="vb-avatar large">${item.avatar}</span><div><span class="kicker">Professor virtual</span><h1>${item.teacher}</h1><p>${item.subject} · ${item.grade}</p></div></div>
          <div class="vb-live-bubble" id="vb-bubble">Quando estiver pronto, comece a aula. Depois, converse normalmente.</div>
          <div class="vb-live-primary"><button type="button" class="btn goldbtn" id="vb-connect">Começar aula</button><button type="button" class="iconbtn" id="vb-mute" disabled aria-label="Silenciar microfone" title="Silenciar microfone">M</button><button type="button" class="iconbtn" id="vb-interrupt" disabled aria-label="Interromper professor" title="Interromper professor">■</button><button type="button" class="textbtn" id="vb-disconnect" disabled>Encerrar</button></div>
          <div class="vb-meter" aria-hidden="true"><i id="vb-meter-bar"></i></div>
          <p class="vb-heard" id="vb-heard">A transcrição da sua fala aparecerá aqui.</p>
          <div class="vb-live-status" id="vb-status" role="status">Aguardando o início da aula.</div>
          <div class="vb-messages" id="vb-messages" aria-live="polite"><div class="vb-message professor">${item.teacher}: Estou pronto para ouvir sua dúvida.</div></div>
          <form id="vb-text-form" class="vb-text-form"><label for="vb-text-question">Também pode escrever</label><div><input id="vb-text-question" maxlength="500" placeholder="Digite uma pergunta para o professor"><button type="submit" class="iconbtn" aria-label="Enviar pergunta">→</button></div></form>
          ${audit ? `<details class="vb-diagnostics"><summary>Diagnóstico da lousa</summary><p>Disponível somente na auditoria interna.</p><div><button type="button" data-vb-demo="fracao">Fração</button><button type="button" data-vb-demo="reta">Reta</button><button type="button" data-vb-demo="fluxo">Fluxo</button><button type="button" data-vb-demo="ciclo">Ciclo</button><button type="button" data-vb-demo="triangulo">Triângulo</button></div><div class="vb-phases"><span id="vb-token">TOKEN</span><span id="vb-ws">WEBSOCKET</span><span id="vb-setup">SETUP</span><span id="vb-mic">MICROFONE</span></div></details>` : ""}
        </section>
        <section class="vb-live-board" aria-label="Quadro construído durante a aula">
          <div class="vb-board-head"><div><span class="kicker">Caderno da sessão</span><strong>Explicação construída com o aluno</strong></div><span id="vb-write-status">Aguardando conversa</span></div>
          <div class="vb-paper"><div id="vb-lines"></div></div>
          <div class="vb-board-actions"><button type="button" class="textbtn" id="vb-clear">Limpar folha</button><button type="button" class="btn" id="vb-save">Salvar caderno</button></div>
        </section>
      </main>
    </div>`;
  }

  function renderNotebookList(ctx) {
    const state = ensureState(ctx.state);
    const rows = state.vaibemLiveNotebooks.length
      ? state.vaibemLiveNotebooks.map((notebook) => `<button type="button" class="resource-row" data-vb-notebook="${escape(notebook.id)}"><span><strong>${escape(notebook.subject)}</strong><small>${escape(notebook.teacher)} · ${escape(notebook.date)} · ${notebook.minutes} min</small></span><span aria-hidden="true">›</span></button>`).join("")
      : `<div class="empty"><h2>Seu primeiro quadro espera por você.</h2><p>Converse com um professor e guarde a aula para construir seu caderno.</p><a class="btn" href="#/vaibem">Ir à minha aula</a></div>`;
    return ctx.shell(`${ctx.pageHead("Meu caderno", "A aula termina.<br>O raciocínio fica.", "Retome quadros, conceitos e exemplos construídos durante a conversa.")}<div class="space">${rows}</div>`, "caderno", "vaibem");
  }

  function renderNotebook(ctx, id) {
    const state = ensureState(ctx.state);
    const notebook = state.vaibemLiveNotebooks.find((item) => item.id === id);
    if (!notebook) return renderNotebookList(ctx);
    return ctx.shell(`${ctx.pageHead("Caderno salvo", escape(notebook.subject), `${escape(notebook.teacher)} · ${escape(notebook.date)}`)}<div class="vb-saved-paper">${notebook.html}</div><div class="space"><button type="button" class="btn" id="vb-download-saved" data-vb-id="${escape(notebook.id)}">Salvar no dispositivo</button></div>`, "caderno", "vaibem");
  }

  function renderProgress(ctx) {
    const state = ensureState(ctx.state);
    const sessions = state.vaibemLiveNotebooks;
    const latest = sessions[0];
    const subjects = Array.from(new Set(sessions.map((item) => item.subject)));
    const evidence = sessions.length
      ? `${sessions.length} ${sessions.length === 1 ? "aula registrada" : "aulas registradas"}${subjects.length ? ` · ${subjects.map(escape).join(" · ")}` : ""}`
      : "A evolução começa depois da primeira conversa com o professor.";
    const next = latest
      ? `Retome ${escape(latest.subject)} e explique, com suas palavras, uma ideia registrada no último quadro.`
      : "Entre na primeira aula e traga uma dúvida real. O professor organizará o ponto de partida.";
    return ctx.shell(`${ctx.pageHead("O que estou aprendendo", "Evidências antes<br>de conclusões.", "A evolução nasce das perguntas, tentativas e explicações guardadas ao longo das aulas.")}
      <section class="vb-progress-band"><div><span class="kicker">Aulas construídas</span><strong>${sessions.length}</strong><p>${evidence}</p></div><div><span class="kicker">Próximo passo</span><h2>${next}</h2><p>A experiência não fixa rótulos de aprendizagem. Ela observa novas evidências e ajusta a explicação.</p></div></section>
      <div class="space">${ctx.link(latest ? "Retomar meu caderno →" : "Começar minha primeira aula →", latest ? "vaibem/caderno" : "vaibem", "btn")}</div>`, "progresso", "vaibem");
  }

  function phase(id, state = "") {
    const element = byId(id);
    if (element) element.className = state;
  }

  function resetPhases() {
    ["vb-token", "vb-ws", "vb-setup", "vb-mic"].forEach((id) => phase(id));
  }

  function setStatus(text, type = "") {
    const element = byId("vb-status");
    if (!element) return;
    element.textContent = text;
    element.className = `vb-live-status${type ? ` ${type}` : ""}`;
  }

  function setBubble(text) {
    const element = byId("vb-bubble");
    if (element) element.textContent = text;
  }

  function addMessage(role, text) {
    if (!text) return;
    const container = byId("vb-messages");
    if (!container) return;
    const message = document.createElement("div");
    message.className = `vb-message ${role}`;
    message.textContent = `${role === "student" ? "Aluno" : teacher().teacher}: ${text}`;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
  }

  function addQuestion(text) {
    const container = byId("vb-lines");
    if (!container || !text) return;
    const question = document.createElement("div");
    question.className = "vb-board-question";
    question.textContent = `Sua pergunta: ${text}`;
    container.appendChild(question);
  }

  function commitOutput() {
    const clean = outputTranscript.trim();
    if (clean) addMessage("professor", clean);
    outputTranscript = "";
  }

  function stopPlayback() {
    audioGeneration += 1;
    activeAudioSources.forEach((source) => { try { source.stop(); } catch (_) {} });
    activeAudioSources = [];
    if (outputCtx) audioNextTime = outputCtx.currentTime;
    audioFirstTime = Infinity;
  }

  function b64ToInt16(base64) {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Int16Array(buffer);
  }

  async function playPcm(base64, rate = 24000) {
    const generation = audioGeneration;
    if (!outputCtx) outputCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (outputCtx.state === "suspended") await outputCtx.resume();
    if (generation !== audioGeneration || suppressOutput) return;
    const pcm = b64ToInt16(base64);
    const audioBuffer = outputCtx.createBuffer(1, pcm.length, rate);
    const channel = audioBuffer.getChannelData(0);
    for (let index = 0; index < pcm.length; index += 1) channel[index] = pcm[index] / 32768;
    const source = outputCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputCtx.destination);
    const start = Math.max(outputCtx.currentTime + 0.02, audioNextTime);
    if (!activeAudioSources.length) audioFirstTime = start;
    source.start(start);
    audioNextTime = start + audioBuffer.duration;
    activeAudioSources.push(source);
    source.onended = () => {
      activeAudioSources = activeAudioSources.filter((item) => item !== source);
      source.disconnect();
    };
  }

  function downsample(input, inputRate, targetRate = 16000) {
    if (inputRate === targetRate) return input;
    if (targetRate > inputRate) return input;
    const ratio = inputRate / targetRate;
    const result = new Float32Array(Math.round(input.length / ratio));
    let position = 0;
    for (let index = 0; index < result.length; index += 1) {
      const next = Math.round((index + 1) * ratio);
      let sum = 0;
      let count = 0;
      for (let cursor = position; cursor < next && cursor < input.length; cursor += 1) {
        sum += input[cursor];
        count += 1;
      }
      result[index] = count ? sum / count : 0;
      position = next;
    }
    return result;
  }

  function floatTo16Base64(float32) {
    const output = new Int16Array(float32.length);
    for (let index = 0; index < float32.length; index += 1) {
      const value = Math.max(-1, Math.min(1, float32[index]));
      output[index] = value < 0 ? value * 32768 : value * 32767;
    }
    const bytes = new Uint8Array(output.buffer);
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    return btoa(binary);
  }

  function rms(data) {
    let sum = 0;
    for (let index = 0; index < data.length; index += 1) sum += data[index] * data[index];
    return Math.sqrt(sum / data.length);
  }

  function systemInstruction() {
    const item = teacher();
    const track = tracks[item.track];
    const ageRule = item.track === "start"
      ? "Use linguagem concreta. Organize cálculos como: o que eu tenho, o que preciso descobrir e qual é o primeiro passo. Faça uma pergunta curta por vez."
      : "Conduza com autonomia crescente: explique o primeiro passo, peça que o aluno proponha o seguinte e intervenha quando houver impasse.";
    return `RESPONDA INCONFUNDIVELMENTE EM PORTUGUÊS DO BRASIL. Você nunca deve responder em espanhol, inglês ou outro idioma, salvo se o aluno pedir explicitamente uma aula de língua estrangeira. Se a fala estiver pouco clara, peça ao aluno que repita em português em vez de adivinhar palavras de outro idioma.
Você é ${item.teacher}, professor particular virtual do ${track.label}. Disciplina: ${item.subject}. Turma de referência: ${item.grade}. ${ageRule}
Converse como um professor atento sentado ao lado do aluno. Escute até o fim, identifique exatamente onde ele travou e responda apenas o necessário. Fale em blocos curtos, com naturalidade e pausas. Se o aluno interromper, pare imediatamente e escute. Termine cada ideia importante com uma pergunta curta de verificação.
Você possui uma lousa pela ferramenta atualizar_lousa. Use-a antes ou durante a explicação para registrar conceitos curtos e revisados. Não transcreva toda a fala. Reutilize o mesmo id para corrigir um bloco.
Quando uma representação visual ajudar, use action=diagrama. Para frações use diagram=fracao e values=[numerador,denominador]. Para reta numérica use diagram=reta_numerica e values=[mínimo,máximo,pontos...]. Para sequências use diagram=fluxo; para processos recorrentes use diagram=ciclo; para comparar valores use diagram=comparacao; para Pitágoras use diagram=triangulo_retangulo. Use títulos e rótulos curtos. Não afirme que desenhou sem chamar a ferramenta.
Em qualquer matéria com cálculo, mostre dados, pedido, conversão necessária, fórmula, isolamento, substituição, fração vertical, cortes válidos, cálculo e resposta interpretada. Não faça contas diretamente com vírgula: converta o decimal para inteiro multiplicado por potência de dez. Não repita unidades em todas as linhas intermediárias, salvo quando forem essenciais em Física. Use subscritos e sobrescritos corretos; equilíbrio químico usa ⇌.
Para proporções use action=regra_de_tres. Classifique antes como direta ou inversa, mantenha grandezas correspondentes na mesma coluna e prefira o fator de escala quando ele for evidente. A ferramenta calcula e desenha; use o resultado retornado.
Para estequiometria use action=estequiometria e stage=preparar; depois apresente uma etapa por vez na ordem: reacao, balanceamento, proporcao, massa_molar, regra_de_tres e resultado. Nunca invente coeficientes ou massas.
Para moléculas reais use action=estrutura com SMILES verificado. O motor valida a estrutura, mas você deve conferir se o nome corresponde ao SMILES.
A ferramenta confirma apenas o enfileiramento. Continue falando enquanto o quadro aparece progressivamente e não leia nomes de comandos para o aluno.`;
  }

  function setupMessage(model) {
    return {
      setup: {
        model,
        tools: [{ functionDeclarations: [window.VaiBemBoard.declaration] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: teacher().voice } } },
        },
        systemInstruction: { parts: [{ text: systemInstruction() }] },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    };
  }

  async function getToken() {
    const response = await fetch("/api/gemini-live-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || payload.detail || payload.error || "Falha ao iniciar o professor");
    return payload;
  }

  async function startMic() {
    if (micStarted) return;
    setStatus("Solicitando acesso ao microfone…");
    const socket = ws;
    const acquired = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
      video: false,
    });
    if (ws !== socket || !connected || !setupReady) {
      acquired.getTracks().forEach((track) => track.stop());
      return;
    }
    stream = acquired;
    inputCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (inputCtx.state === "suspended") await inputCtx.resume();
    sourceNode = inputCtx.createMediaStreamSource(stream);
    processor = inputCtx.createScriptProcessor(1024, 1, 1);
    zeroGain = inputCtx.createGain();
    zeroGain.gain.value = 0;
    processor.onaudioprocess = (event) => {
      const raw = event.inputBuffer.getChannelData(0);
      const level = Math.min(1, rms(raw) * 7);
      if (byId("vb-meter-bar")) byId("vb-meter-bar").style.width = `${(level * 100).toFixed(0)}%`;
      if (!muted && connected && setupReady && ws?.readyState === WebSocket.OPEN) {
        const pcm = downsample(raw, inputCtx.sampleRate, 16000);
        ws.send(JSON.stringify({ realtimeInput: { audio: { data: floatTo16Base64(pcm), mimeType: "audio/pcm;rate=16000" } } }));
      }
    };
    sourceNode.connect(processor);
    processor.connect(zeroGain);
    zeroGain.connect(inputCtx.destination);
    micStarted = true;
    phase("vb-mic", "ok");
    byId("vb-mute").disabled = false;
    byId("vb-interrupt").disabled = false;
    byId("vb-disconnect").disabled = false;
    byId("vb-live-state").textContent = "AO VIVO";
    byId("vb-live-state").className = "vb-live-on";
    setStatus("Microfone ativo. Pode falar normalmente.", "good");
    setBubble("Estou ouvindo. Faça sua pergunta normalmente.");
    ws.send(JSON.stringify({ clientContent: { turns: [{ role: "user", parts: [{ text: `Inicie a aula saudando o aluno em português brasileiro e pergunte qual é a dúvida de ${teacher().subject}.` }] }], turnComplete: true } }));
  }

  function extractAudioParts(message) {
    const parts = message?.serverContent?.modelTurn?.parts || [];
    return parts.filter((part) => part?.inlineData?.data && String(part.inlineData.mimeType || "").startsWith("audio/")).map((part) => part.inlineData);
  }

  async function handleToolCalls(toolCall) {
    const socket = ws;
    const epoch = board.epoch;
    const responses = [];
    for (const call of toolCall.functionCalls || []) {
      if (socket !== ws || epoch !== board.epoch) return;
      let response;
      try {
        if (call.name !== "atualizar_lousa") throw new Error("Ferramenta desconhecida");
        if (suppressOutput) throw new Error("Explicação interrompida");
        response = await board.commandAsync(call.args, call.id);
      } catch (error) {
        response = { ok: false, error: error.message };
        setStatus(`Quadro: ${error.message}`, "bad");
      }
      responses.push({ id: call.id, name: call.name, response });
    }
    if (responses.length && socket === ws && epoch === board.epoch && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ toolResponse: { functionResponses: responses } }));
    }
  }

  function flushInput() {
    const clean = inputTranscript.trim();
    if (!clean) return;
    addQuestion(clean);
    addMessage("student", clean);
    inputTranscript = "";
  }

  async function handleServer(message) {
    if (message.setupComplete) {
      setupReady = true;
      phase("vb-setup", "ok");
      setStatus("Professor conectado. Ativando o microfone…", "good");
      startMic().catch((error) => {
        phase("vb-mic", "fail");
        setStatus(`Não foi possível abrir o microfone: ${error.message}`, "bad");
      });
      return;
    }
    if (message.toolCallCancellation) board.cancelCalls(message.toolCallCancellation.ids || []);
    if (message.toolCall) {
      flushInput();
      handleToolCalls(message.toolCall).catch(() => setStatus("Não foi possível atualizar o quadro agora.", "bad"));
    }
    const content = message.serverContent;
    if (!content) return;
    if (content.interrupted) {
      stopPlayback();
      board.interrupt();
      outputTranscript = "";
      suppressOutput = false;
      setBubble("Pode falar. Eu parei para ouvir você.");
    }
    const inputText = String(content.inputTranscription?.text || "");
    if (inputText) {
      inputTranscript += inputText;
      if (byId("vb-heard")) byId("vb-heard").textContent = `Você: ${inputTranscript}`;
    }
    const outputText = String(content.outputTranscription?.text || "");
    const audioParts = extractAudioParts(message);
    if (!suppressOutput && !content.interrupted) {
      if (outputText || audioParts.length) flushInput();
      for (const part of audioParts) {
        const rate = Number(/rate=(\d+)/.exec(part.mimeType || "")?.[1] || 24000);
        try { await playPcm(part.data, rate); } catch (_) { setStatus("O áudio do professor não pôde ser reproduzido.", "bad"); }
      }
      if (outputText) {
        outputTranscript += outputText;
        board.transcript(outputTranscript);
        setBubble("Estou explicando. Acompanhe o quadro e me interrompa quando precisar.");
      }
    }
    if (content.turnComplete) {
      flushInput();
      if (!suppressOutput && !content.interrupted) {
        commitOutput();
        board.finish();
      } else outputTranscript = "";
      suppressOutput = false;
      if (byId("vb-heard")) byId("vb-heard").textContent = "Pode fazer a próxima pergunta.";
    }
  }

  async function decodeLiveMessage(data) {
    let text;
    if (typeof data === "string") text = data;
    else if (data instanceof Blob) text = await data.text();
    else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) text = new TextDecoder().decode(data);
    else throw new TypeError("Formato de mensagem não suportado");
    return JSON.parse(text);
  }

  function attachLiveMessages(socket) {
    let pending = Promise.resolve();
    socket.onmessage = (event) => {
      pending = pending.then(async () => {
        if (ws !== socket || !connected) return;
        const message = await decodeLiveMessage(event.data);
        if (ws !== socket || !connected) return;
        await handleServer(message);
      }).catch(() => {
        if (ws !== socket || !connected) return;
        setStatus("Uma mensagem do professor não pôde ser processada. Encerre e reconecte.", "bad");
      });
    };
  }

  async function connect() {
    if (connected) return;
    resetPhases();
    byId("vb-connect").disabled = true;
    setStatus("Preparando uma conexão segura…");
    try {
      const token = await getToken();
      phase("vb-token", "ok");
      const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(token.token)}`;
      ws = new WebSocket(url);
      const socket = ws;
      ws.onopen = () => {
        connected = true;
        setupReady = false;
        phase("vb-ws", "ok");
        byId("vb-live-state").textContent = "CONECTANDO";
        byId("vb-live-state").className = "vb-live-on";
        setStatus("Conexão aberta. Preparando o professor…", "good");
        ws.send(JSON.stringify(setupMessage(token.model)));
      };
      attachLiveMessages(ws);
      ws.onerror = () => {
        phase("vb-ws", "fail");
        setStatus("A conexão em tempo real falhou. Tente novamente.", "bad");
      };
      ws.onclose = (event) => {
        if (ws !== socket) return;
        ws = null;
        releaseSessionResources();
        const state = byId("vb-live-state");
        if (state) { state.textContent = "DESCONECTADO"; state.className = "vb-live-off"; }
        if (byId("vb-connect")) byId("vb-connect").disabled = false;
        setStatus(`Sessão encerrada${event.code && event.code !== 1000 ? ` · código ${event.code}` : ""}.`, event.code === 1000 ? "" : "bad");
      };
    } catch (error) {
      byId("vb-connect").disabled = false;
      phase("vb-token", "fail");
      setStatus(error.message, "bad");
    }
  }

  function releaseSessionResources() {
    connected = false;
    setupReady = false;
    micStarted = false;
    muted = false;
    stopPlayback();
    board?.interrupt();
    suppressOutput = false;
    if (processor) processor.onaudioprocess = null;
    [processor, sourceNode, zeroGain].forEach((node) => { if (node) try { node.disconnect(); } catch (_) {} });
    if (stream) stream.getTracks().forEach((track) => track.stop());
    const contexts = [inputCtx, outputCtx];
    processor = sourceNode = zeroGain = stream = inputCtx = outputCtx = null;
    audioNextTime = 0;
    inputTranscript = "";
    outputTranscript = "";
    if (byId("vb-meter-bar")) byId("vb-meter-bar").style.width = "0%";
    if (byId("vb-mute")) byId("vb-mute").textContent = "M";
    resetPhases();
    return Promise.allSettled(contexts.filter(Boolean).map((audioContext) => audioContext.state === "closed" ? Promise.resolve() : audioContext.close()));
  }

  async function disconnect() {
    const socket = ws;
    ws = null;
    const cleanup = releaseSessionResources();
    if (socket) try { socket.close(1000, "Encerrada pelo aluno"); } catch (_) {}
    if (byId("vb-live-state")) { byId("vb-live-state").textContent = "DESCONECTADO"; byId("vb-live-state").className = "vb-live-off"; }
    if (byId("vb-connect")) byId("vb-connect").disabled = false;
    if (byId("vb-mute")) byId("vb-mute").disabled = true;
    if (byId("vb-interrupt")) byId("vb-interrupt").disabled = true;
    if (byId("vb-disconnect")) byId("vb-disconnect").disabled = true;
    setStatus("Sessão encerrada.");
    await cleanup;
  }

  function sendTextQuestion(text) {
    const clean = text.trim();
    if (!clean) return;
    if (!connected || !setupReady || ws?.readyState !== WebSocket.OPEN) {
      setStatus("Comece a aula antes de enviar uma pergunta.", "bad");
      return;
    }
    addQuestion(clean);
    addMessage("student", clean);
    ws.send(JSON.stringify({ clientContent: { turns: [{ role: "user", parts: [{ text: clean }] }], turnComplete: true } }));
  }

  function notebookHtml() {
    return byId("vb-lines")?.innerHTML || "";
  }

  function exportNotebook(name, html) {
    const style = `<style>body{font-family:Arial,sans-serif;background:#f7f7f2;padding:28px;color:#202820}.page{max-width:900px;margin:auto;background:#fffdf6;padding:42px;border:1px solid #dce2d7}.board-note,.board-stoich,.board-figure,.vb-board-question{margin:18px 0;padding:14px;border-bottom:1px solid #d8e1ea}.board-label{display:block;font-size:11px;text-transform:uppercase;color:#687991}.board-content{font:20px/1.6 Georgia,serif;color:#174a7c}.board-figure svg{width:100%;height:auto}.board-diagram .diagram-line,.board-diagram .diagram-shape{stroke:#244f78;stroke-width:3;fill:#fff}.board-diagram .diagram-fill{fill:#d7e6ad;stroke:#365845;stroke-width:2}.board-diagram text{font:18px Arial;fill:#203b54}.proportion-row{display:grid;grid-template-columns:1fr 1fr 1fr;text-align:center}.proportion-fraction{display:inline-flex;flex-direction:column}.proportion-numerator{border-bottom:2px solid}</style>`;
    const file = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(name)}</title>${style}<body><main class="page"><h1>${escape(name)}</h1>${html}</main></body></html>`;
    const url = URL.createObjectURL(new Blob([file], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${name.replace(/[^a-z0-9]+/gi, "_")}.html`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function saveSession(goToNotebook = false) {
    const html = notebookHtml();
    if (!html.trim()) {
      context.toast("O quadro ainda está vazio.");
      return;
    }
    const item = teacher();
    const id = `vb-${Date.now()}`;
    const elapsed = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 1;
    const notebook = {
      id,
      teacher: item.teacher,
      subject: item.subject,
      grade: item.grade,
      date: new Date().toLocaleDateString("pt-BR"),
      minutes: elapsed,
      html,
    };
    context.state.vaibemLiveNotebooks.unshift(notebook);
    context.state.vaibemLiveNotebooks = context.state.vaibemLiveNotebooks.slice(0, 8);
    context.state.vaibemLiveNotebookId = id;
    context.save();
    context.toast("Aula guardada no seu caderno.");
    if (goToNotebook) context.go(`vaibem/caderno/${encodeURIComponent(id)}`);
  }

  function demoDiagram(type) {
    const demos = {
      fracao: { action: "diagrama", id: "demo-fracao", diagram: "fracao", title: "Três quartos do inteiro", values: [3, 4], labels: [] },
      reta: { action: "diagrama", id: "demo-reta", diagram: "reta_numerica", title: "Localizando valores", values: [0, 10, 2, 5, 8], labels: [] },
      fluxo: { action: "diagrama", id: "demo-fluxo", diagram: "fluxo", title: "Como resolver", labels: ["Dados", "Pedido", "Estratégia", "Resposta"], values: [] },
      ciclo: { action: "diagrama", id: "demo-ciclo", diagram: "ciclo", title: "Ciclo da água", labels: ["Evaporação", "Condensação", "Precipitação", "Infiltração"], values: [] },
      triangulo: { action: "diagrama", id: "demo-triangulo", diagram: "triangulo_retangulo", title: "Teorema de Pitágoras", labels: ["cateto a", "cateto b", "hipotenusa c"], values: [] },
    };
    board.command(demos[type], `demo-${type}-${Date.now()}`);
    board.finish();
    context.toast("Diagrama enfileirado na lousa.");
  }

  function mount(route, ctx) {
    context = ctx;
    ensureState(ctx.state);
    if (route === "vaibem") {
      document.querySelectorAll("[data-vb-track]").forEach((button) => button.addEventListener("click", () => {
        ctx.state.vaibemTrack = button.dataset.vbTrack;
        ensureState(ctx.state);
        ctx.save();
        ctx.render(false);
      }));
      document.querySelectorAll("[data-vb-teacher]").forEach((button) => button.addEventListener("click", () => {
        ctx.state.vaibemTeacher = button.dataset.vbTeacher;
        ctx.save();
        ctx.render(false);
      }));
      byId("vb-enter-room")?.addEventListener("click", () => ctx.go("vaibem/sala"));
      return;
    }
    if (route === "vaibem/caderno") {
      document.querySelectorAll("[data-vb-notebook]").forEach((button) => button.addEventListener("click", () => ctx.go(`vaibem/caderno/${encodeURIComponent(button.dataset.vbNotebook)}`)));
      return;
    }
    if (route.startsWith("vaibem/caderno/")) {
      byId("vb-download-saved")?.addEventListener("click", () => {
        const notebook = ctx.state.vaibemLiveNotebooks.find((item) => item.id === byId("vb-download-saved").dataset.vbId);
        if (notebook) exportNotebook(`VaiBem_${notebook.subject}_${notebook.date}`, notebook.html);
      });
      return;
    }
    if (route !== "vaibem/sala") return;
    mode = ctx.state.vaibemTeacher;
    startedAt = Date.now();
    board = new window.VaiBemBoard.Board({
      container: byId("vb-lines"),
      status: byId("vb-write-status"),
      audio: () => ({ exists: Boolean(outputCtx), running: outputCtx?.state === "running", time: outputCtx?.currentTime || 0, start: audioFirstTime, end: audioNextTime }),
    });
    window.VaiBemChem.ready().catch(() => {});
    byId("vb-back-home")?.addEventListener("click", async () => { await disconnect(); ctx.go("vaibem"); });
    byId("vb-connect")?.addEventListener("click", connect);
    byId("vb-mute")?.addEventListener("click", () => {
      muted = !muted;
      byId("vb-mute").textContent = muted ? "A" : "M";
      byId("vb-mute").setAttribute("aria-label", muted ? "Ativar microfone" : "Silenciar microfone");
      setStatus(muted ? "Microfone silenciado." : "Microfone ativo.", "good");
    });
    byId("vb-interrupt")?.addEventListener("click", () => {
      suppressOutput = true;
      stopPlayback();
      board.interrupt();
      outputTranscript = "";
      setBubble("Interrompido. Pode falar.");
    });
    byId("vb-disconnect")?.addEventListener("click", disconnect);
    byId("vb-clear")?.addEventListener("click", () => { board.clear(); outputTranscript = ""; });
    byId("vb-save")?.addEventListener("click", () => saveSession(false));
    byId("vb-text-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const field = byId("vb-text-question");
      sendTextQuestion(field.value);
      if (connected && setupReady) field.value = "";
    });
    document.querySelectorAll("[data-vb-demo]").forEach((button) => button.addEventListener("click", () => demoDiagram(button.dataset.vbDemo)));
  }

  async function dispose() {
    if (ws || connected || inputCtx || outputCtx) await disconnect();
    board = null;
  }

  window.CAV_VAIBEM_LIVE = {
    teachers,
    tracks,
    ensureState,
    renderHome,
    renderRoom,
    renderNotebookList,
    renderNotebook,
    renderProgress,
    mount,
    dispose,
    decodeLiveMessage,
    systemInstruction,
  };
})();
