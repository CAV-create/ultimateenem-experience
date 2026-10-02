(() => {
  "use strict";

  const MAX_FILE_BYTES = 3 * 1024 * 1024;
  const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
  const sourceFiles = new Map();
  let selectedFile = null;
  let selectedUrl = "";

  const byId = (id) => document.getElementById(id);
  const live = () => window.CAV_VAIBEM_LIVE;
  const esc = (ctx, value) => ctx?.esc ? ctx.esc(value) : String(value || "");

  function ensureState(state) {
    state.vaibemActivities = Array.isArray(state.vaibemActivities) ? state.vaibemActivities : [];
    state.vaibemLessonPlans = state.vaibemLessonPlans && typeof state.vaibemLessonPlans === "object" ? state.vaibemLessonPlans : {};
    return state;
  }

  function activeTeacher(state) {
    return live()?.teachers?.[state.vaibemTeacher] || Object.values(live()?.teachers || {})[0] || { id: "teacher", teacher: "Professor do VaiBem", subject: "Componente curricular" };
  }

  function activeGrade(state) {
    const track = state.vaibemTrack || "start";
    const grades = live()?.grades?.[track] || [];
    return grades.find((item) => item.id === state.vaibemGrade) || grades[0] || { id: "grade", label: "Ano escolar" };
  }

  function lessonKey(state, teacherId = state.vaibemTeacher, gradeId = state.vaibemGrade) {
    return `${teacherId || "teacher"}::${gradeId || "grade"}`;
  }

  function currentPlan(state, teacherId = state.vaibemTeacher, gradeId = state.vaibemGrade) {
    ensureState(state);
    return state.vaibemLessonPlans[lessonKey(state, teacherId, gradeId)] || null;
  }

  function planBriefing(state, teacherId = state.vaibemTeacher, gradeId = state.vaibemGrade) {
    const plan = currentPlan(state, teacherId, gradeId);
    if (!plan) return "";
    const sequence = (plan.sequence || []).map((step) => `${step.stage}: ${step.title} — ${step.instruction}`).join(" | ");
    return `AULA PREPARADA PELO ALUNO. Conteúdos: ${plan.topics}. Título: ${plan.topicTitle}. Objetivos: ${(plan.objectives || []).join("; ")}. Abertura diagnóstica: ${plan.openingQuestion}. Sequência: ${sequence}. Orientação reservada ao professor: ${plan.teacherBriefing}`.slice(0, 5000);
  }

  function homeRows(ctx) {
    const state = ensureState(ctx.state);
    const teacher = activeTeacher(state);
    const grade = activeGrade(state);
    const plan = currentPlan(state);
    const activities = state.vaibemActivities.filter((item) => item.subject === teacher.subject && item.grade === grade.label).length;
    return `${ctx.row("Enviar atividade ou prova", `PDF ou foto para ${teacher.teacher} corrigir e comentar · ${grade.label}.`, "vaibem/atividade", "book")}
      ${ctx.row("Preparar a próxima aula", plan ? `${plan.topicTitle} já está preparado para ${grade.label}.` : "Informe o que vai cair e o professor chegará com a aula preparada.", "vaibem/preparar", "calendar")}
      ${activities ? `<p class="vb-home-evidence">${activities} ${activities === 1 ? "atividade corrigida" : "atividades corrigidas"} nesta disciplina e neste ano escolar.</p>` : ""}`;
  }

  function fileLabel(fileName, fileType) {
    if (!fileName) return "Selecione um PDF ou uma foto nítida";
    return `${fileType === "application/pdf" ? "PDF" : "Foto"} · ${fileName}`;
  }

  function renderActivity(ctx) {
    const state = ensureState(ctx.state);
    const teacher = activeTeacher(state);
    const grade = activeGrade(state);
    const recent = state.vaibemActivities.slice(0, 5);
    const history = recent.length
      ? `<section class="vb-study-history"><div class="kicker">Últimas correções</div>${recent.map((item) => `<button type="button" class="resource-row" data-vb-activity-id="${esc(ctx, item.id)}"><span><strong>${esc(ctx, item.overview?.title || item.fileName)}</strong><small>${esc(ctx, item.subject)} · ${esc(ctx, item.grade)} · ${item.overview?.errorCount || 0} erro(s)</small></span><span aria-hidden="true">›</span></button>`).join("")}</section>`
      : "";
    return ctx.shell(`${ctx.pageHead("Correção de atividade", "Envie. Receba a folha comentada. Avance.", `${teacher.teacher} fará a leitura de ${teacher.subject} conforme o ${grade.label}.`)}
      <section class="vb-study-context"><span class="kicker">Professor responsável</span><strong>${esc(ctx, teacher.teacher)}</strong><p>${esc(ctx, teacher.subject)} · ${esc(ctx, grade.label)}</p></section>
      <form id="vb-activity-form" class="vb-study-form">
        <label class="vb-upload-zone" for="vb-activity-file"><input id="vb-activity-file" type="file" accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"><span class="vb-upload-symbol" aria-hidden="true">＋</span><strong id="vb-activity-file-label">${fileLabel("", "")}</strong><small>Até 3 MB. No celular, você também pode fotografar a folha.</small></label>
        <label class="field">Nome da atividade<input id="vb-activity-name" maxlength="160" placeholder="Ex.: revisão de frações ou prova de Ciências"></label>
        <details class="vb-study-optional"><summary>Tenho um gabarito separado</summary><label class="field">Gabarito opcional<textarea id="vb-activity-key" rows="3" maxlength="2500" placeholder="Ex.: 1-A, 2-C, 3-B ou observações do professor"></textarea></label></details>
        <div id="vb-activity-status" class="vb-study-status" role="status">O arquivo só será enviado quando você solicitar a correção.</div>
        <button type="submit" class="btn goldbtn" id="vb-activity-submit">Corrigir minha atividade →</button>
      </form>${history}`, "caderno", "vaibem");
  }

  function statusLabel(status) {
    return { correct: "Acertou", partial: "Parcial", incorrect: "Precisa rever", attention: "Confirmar leitura" }[status] || "Análise";
  }

  function reviewSource(ctx, review) {
    const source = sourceFiles.get(review.id);
    if (!source) return `<div class="vb-source-missing"><strong>O documento original não está mais carregado neste navegador.</strong><p>A correção e a recuperação continuam disponíveis. Para rever a folha lado a lado, envie o arquivo novamente.</p></div>`;
    if (review.mimeType === "application/pdf") {
      return `<div class="vb-pdf-frame"><object data="${source.url}" type="application/pdf" aria-label="PDF original enviado"><p><a href="${source.url}" target="_blank" rel="noopener">Abrir o PDF original</a></p></object></div><a class="textbtn under" href="${source.url}" target="_blank" rel="noopener">Abrir original em outra aba</a>`;
    }
    const markers = review.annotations.filter((item) => item.position).map((item, index) => `<button type="button" class="vb-document-marker status-${item.status}" style="left:${item.position.x}%;top:${item.position.y}%" data-vb-annotation-link="${esc(ctx, item.id)}" aria-label="Abrir comentário da questão ${item.questionNumber}">${index + 1}</button>`).join("");
    return `<div class="vb-image-review"><img src="${source.url}" alt="Atividade original enviada pelo aluno">${markers}</div>`;
  }

  function annotationCards(ctx, annotations) {
    return annotations.map((item, index) => `<article class="vb-annotation-card status-${item.status}" id="${esc(ctx, item.id)}">
      <header><span>${index + 1}</span><div><strong>${esc(ctx, item.anchor || `Questão ${item.questionNumber}`)}</strong><small>Página ${item.page} · ${statusLabel(item.status)}</small></div></header>
      ${item.studentAnswer ? `<p><b>Resposta encontrada:</b> ${esc(ctx, item.studentAnswer)}</p>` : ""}
      ${item.expectedAnswer ? `<p><b>Resposta esperada:</b> ${esc(ctx, item.expectedAnswer)}</p>` : ""}
      <p>${esc(ctx, item.comment)}</p><p class="vb-annotation-why">${esc(ctx, item.why)}</p>
      <footer>${[item.topic, item.skill].filter(Boolean).map((label) => `<span>${esc(ctx, label)}</span>`).join("")}</footer>
    </article>`).join("");
  }

  function errorReport(ctx, review) {
    if (!review.needsRecovery || !review.recovery) return `<section class="vb-no-recovery"><span class="kicker">Conduta</span><h2>Não foi necessário abrir uma recuperação completa.</h2><p>Os comentários pontuais acima são suficientes para orientar a revisão desta atividade.</p></section>`;
    const report = review.errorReport.map((item) => `<tr><td><strong>${esc(ctx, item.topic)}</strong><small>${esc(ctx, item.skill)}</small></td><td>${esc(ctx, item.evidence)}</td><td><span class="vb-priority ${item.priority}">${esc(ctx, item.priority)}</span><br>${esc(ctx, item.nextStep)}</td></tr>`).join("");
    const examples = (review.recovery.workedExamples || []).map((example, index) => `<article class="vb-worked-example"><span class="kicker">Exemplo resolvido ${index + 1}</span><h3>${esc(ctx, example.title)}</h3><p>${esc(ctx, example.problem)}</p><ol>${(example.steps || []).map((step) => `<li>${esc(ctx, step)}</li>`).join("")}</ol><strong>${esc(ctx, example.answer)}</strong></article>`).join("");
    const exercises = (review.recovery.exercises || []).map((exercise) => `<article class="vb-print-question"><strong>${exercise.number}.</strong><div><p>${esc(ctx, exercise.statement)}</p>${exercise.support ? `<small>${esc(ctx, exercise.support)}</small>` : ""}<div class="vb-answer-lines" aria-hidden="true"></div></div></article>`).join("");
    const answers = (review.recovery.exercises || []).map((exercise) => `<li><strong>${exercise.number}.</strong> ${esc(ctx, exercise.answer)}${exercise.comment ? `<br><small>${esc(ctx, exercise.comment)}</small>` : ""}</li>`).join("");
    return `<section class="vb-error-report"><div class="kicker">Relatório dos erros</div><h2>${esc(ctx, review.recovery.title)}</h2><p>${esc(ctx, review.recovery.reason)}</p><div class="vb-table-scroll"><table><thead><tr><th>Conteúdo e habilidade</th><th>Evidência</th><th>Próxima conduta</th></tr></thead><tbody>${report}</tbody></table></div></section>
      <section class="vb-recovery-summary"><div><span class="kicker">Microresumo</span><p>${esc(ctx, review.recovery.microSummary)}</p></div><ul>${(review.recovery.guidance || []).map((item) => `<li>${esc(ctx, item)}</li>`).join("")}</ul></section>
      ${examples ? `<section class="vb-worked-grid">${examples}</section>` : ""}
      <section class="vb-printable-list"><header><div><span class="kicker">Lista imprimível de recuperação</span><h2>Agora é a sua vez.</h2></div><button type="button" class="btn" id="vb-print-review">Imprimir revisão</button></header>${exercises}</section>
      <section class="vb-print-answer-key"><span class="kicker">Gabarito comentado</span><ol>${answers}</ol></section>`;
  }

  function renderReview(ctx, id) {
    const state = ensureState(ctx.state);
    const review = state.vaibemActivities.find((item) => item.id === id);
    if (!review) return renderActivity(ctx);
    const overview = review.overview || {};
    return ctx.shell(`<div class="vb-review-print-root">${ctx.pageHead("Folha comentada", esc(ctx, overview.title || review.fileName), `${esc(ctx, review.subject)} · ${esc(ctx, review.grade)} · ${esc(ctx, review.teacher)}`)}
      <section class="vb-review-score"><div><span class="kicker">Leitura da atividade</span><p>${esc(ctx, overview.summary)}</p></div><div class="vb-review-counts"><span><strong>${overview.correctCount || 0}</strong>acertos</span><span><strong>${overview.partialCount || 0}</strong>parciais</span><span><strong>${overview.errorCount || 0}</strong>a rever</span></div></section>
      <section class="vb-review-workspace"><div class="vb-document-column"><div class="kicker">Documento do aluno</div>${reviewSource(ctx, review)}</div><aside class="vb-comments-column"><div class="kicker">Comentários no documento</div>${annotationCards(ctx, review.annotations || [])}</aside></section>
      ${errorReport(ctx, review)}
      <div class="vb-review-actions"><a class="textbtn under" href="#/vaibem/atividade">Enviar outra atividade</a>${!review.needsRecovery ? `<button type="button" class="btn" id="vb-print-review">Imprimir correção</button>` : ""}</div></div>`, "caderno", "vaibem");
  }

  function renderPreparation(ctx) {
    const state = ensureState(ctx.state);
    const teacher = activeTeacher(state);
    const grade = activeGrade(state);
    const plan = currentPlan(state);
    return ctx.shell(`${ctx.pageHead("Preparar a próxima aula", "Conte o que vai cair. O professor cuida do resto.", `${teacher.teacher} receberá o planejamento antes da aula de ${teacher.subject}.`)}
      <section class="vb-study-context"><span class="kicker">Aula destinada a</span><strong>${esc(ctx, teacher.teacher)}</strong><p>${esc(ctx, teacher.subject)} · ${esc(ctx, grade.label)}</p></section>
      <form id="vb-lesson-form" class="vb-study-form">
        <label class="field">Conteúdos que vão cair<textarea id="vb-lesson-topics" rows="7" maxlength="4000" required placeholder="Ex.: frações equivalentes, comparação de frações e problemas com parte de um todo">${esc(ctx, plan?.topics || "")}</textarea></label>
        <label class="field">Data da prova ou atividade, se houver<input id="vb-lesson-date" type="date" value="${esc(ctx, plan?.assessmentDate || "")}"></label>
        <div class="vb-study-status" id="vb-lesson-status" role="status">O professor organizará explicação, exemplos, recursos visuais, verificações e uma prática curta.</div>
        <button type="submit" class="btn goldbtn" id="vb-lesson-submit">Preparar minha aula →</button>
      </form>`, "hoje", "vaibem");
  }

  function renderPrepared(ctx) {
    const state = ensureState(ctx.state);
    const plan = currentPlan(state);
    const teacher = activeTeacher(state);
    if (!plan) return renderPreparation(ctx);
    const sequence = (plan.sequence || []).map((step, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><div><small>${esc(ctx, step.stage)}</small><h3>${esc(ctx, step.title)}</h3><p>${esc(ctx, step.instruction)}</p><em>${esc(ctx, step.visualTool)}</em><strong>${esc(ctx, step.check)}</strong></div></article>`).join("");
    const examples = (plan.guidedExamples || []).map((example) => `<details><summary>${esc(ctx, example.title)}</summary><p>${esc(ctx, example.prompt)}</p><ol>${(example.steps || []).map((step) => `<li>${esc(ctx, step)}</li>`).join("")}</ol><strong>${esc(ctx, example.answer)}</strong></details>`).join("");
    return ctx.shell(`${ctx.pageHead("Aula preparada", esc(ctx, plan.topicTitle), `${esc(ctx, teacher.teacher)} já recebeu o plano para ${esc(ctx, plan.grade)}.`)}
      <section class="vb-prepared-hero"><span class="kicker">Tudo pronto</span><p>${esc(ctx, plan.summary)}</p><blockquote>${esc(ctx, plan.openingQuestion)}</blockquote><a class="btn goldbtn" href="#/vaibem/sala">Entrar na aula preparada →</a></section>
      <section class="vb-lesson-objectives"><div><span class="kicker">Objetivos da aula</span><ul>${(plan.objectives || []).map((item) => `<li>${esc(ctx, item)}</li>`).join("")}</ul></div><div><span class="kicker">Vocabulário-chave</span><p>${(plan.vocabulary || []).map((item) => `<span>${esc(ctx, item)}</span>`).join("")}</p></div></section>
      <section class="vb-lesson-sequence"><div class="kicker">Como a aula foi organizada</div>${sequence}</section>
      ${examples ? `<section class="vb-prepared-examples"><div class="kicker">Exemplos reservados para a explicação</div>${examples}</section>` : ""}
      <div class="vb-review-actions"><a class="textbtn under" href="#/vaibem/preparar">Alterar conteúdos</a><button type="button" class="btn" id="vb-print-lesson">Imprimir plano</button></div>`, "hoje", "vaibem");
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
      reader.readAsDataURL(file);
    });
  }

  function setStatus(id, text, type = "") {
    const node = byId(id);
    if (!node) return;
    node.textContent = text;
    node.className = `vb-study-status${type ? ` ${type}` : ""}`;
  }

  async function submitActivity(event, ctx) {
    event.preventDefault();
    if (!selectedFile) return setStatus("vb-activity-status", "Escolha um PDF ou uma foto antes de continuar.", "bad");
    if (!allowedTypes.has(selectedFile.type)) return setStatus("vb-activity-status", "Use PDF, JPG, PNG ou WebP.", "bad");
    if (selectedFile.size > MAX_FILE_BYTES) return setStatus("vb-activity-status", "O arquivo precisa ter até 3 MB.", "bad");
    const button = byId("vb-activity-submit");
    button.disabled = true;
    setStatus("vb-activity-status", "O professor está lendo cada questão e preparando os comentários…", "working");
    try {
      const teacher = activeTeacher(ctx.state);
      const grade = activeGrade(ctx.state);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const response = await fetch("/api/vaibem-study-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "review_activity",
          dataUrl,
          fileName: selectedFile.name,
          name: byId("vb-activity-name").value.trim(),
          answerKey: byId("vb-activity-key").value.trim(),
          subject: teacher.subject,
          teacher: teacher.teacher,
          grade: grade.label,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.review) throw new Error(payload.message || "A correção não foi concluída.");
      const review = payload.review;
      sourceFiles.set(review.id, { file: selectedFile, url: selectedUrl || URL.createObjectURL(selectedFile), mimeType: selectedFile.type });
      ensureState(ctx.state).vaibemActivities.unshift(review);
      ctx.state.vaibemActivities = ctx.state.vaibemActivities.slice(0, 8);
      ctx.save();
      selectedFile = null;
      selectedUrl = "";
      ctx.go(`vaibem/atividade/${encodeURIComponent(review.id)}`);
    } catch (error) {
      button.disabled = false;
      setStatus("vb-activity-status", error.message, "bad");
    }
  }

  async function submitLesson(event, ctx) {
    event.preventDefault();
    const topics = byId("vb-lesson-topics").value.trim();
    if (topics.length < 3) return setStatus("vb-lesson-status", "Escreva pelo menos um conteúdo que será estudado.", "bad");
    const button = byId("vb-lesson-submit");
    button.disabled = true;
    setStatus("vb-lesson-status", "O professor está organizando a explicação, os exemplos e a prática…", "working");
    try {
      const teacher = activeTeacher(ctx.state);
      const grade = activeGrade(ctx.state);
      const response = await fetch("/api/vaibem-study-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "prepare_lesson", topics, assessmentDate: byId("vb-lesson-date").value, subject: teacher.subject, teacher: teacher.teacher, grade: grade.label }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.lesson) throw new Error(payload.message || "A aula não pôde ser preparada agora.");
      ensureState(ctx.state).vaibemLessonPlans[lessonKey(ctx.state)] = payload.lesson;
      ctx.save();
      ctx.go("vaibem/preparar/resultado");
    } catch (error) {
      button.disabled = false;
      setStatus("vb-lesson-status", error.message, "bad");
    }
  }

  function mount(route, ctx) {
    ensureState(ctx.state);
    if (route === "vaibem/atividade") {
      const input = byId("vb-activity-file");
      input?.addEventListener("change", () => {
        if (selectedUrl) URL.revokeObjectURL(selectedUrl);
        selectedFile = input.files?.[0] || null;
        selectedUrl = selectedFile ? URL.createObjectURL(selectedFile) : "";
        if (byId("vb-activity-file-label")) byId("vb-activity-file-label").textContent = fileLabel(selectedFile?.name, selectedFile?.type);
        setStatus("vb-activity-status", selectedFile ? "Arquivo pronto para a leitura do professor." : "Escolha um arquivo para continuar.", selectedFile ? "good" : "");
      });
      byId("vb-activity-form")?.addEventListener("submit", (event) => submitActivity(event, ctx));
      document.querySelectorAll("[data-vb-activity-id]").forEach((button) => button.addEventListener("click", () => ctx.go(`vaibem/atividade/${encodeURIComponent(button.dataset.vbActivityId)}`)));
      return;
    }
    if (route.startsWith("vaibem/atividade/")) {
      document.querySelectorAll("[data-vb-annotation-link]").forEach((button) => button.addEventListener("click", () => byId(button.dataset.vbAnnotationLink)?.scrollIntoView({ behavior: "smooth", block: "center" })));
      byId("vb-print-review")?.addEventListener("click", () => window.print());
      return;
    }
    if (route === "vaibem/preparar") {
      byId("vb-lesson-form")?.addEventListener("submit", (event) => submitLesson(event, ctx));
      return;
    }
    if (route === "vaibem/preparar/resultado") byId("vb-print-lesson")?.addEventListener("click", () => window.print());
  }

  window.CAV_VAIBEM_STUDY = {
    ensureState,
    activeGrade,
    currentPlan,
    planBriefing,
    homeRows,
    renderActivity,
    renderReview,
    renderPreparation,
    renderPrepared,
    mount,
  };
})();
