#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import shutil
import unicodedata
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
INGEST = ROOT / "_ingest" / "dropbox-redacao-20260905"
BONUS = INGEST / "bonus_ditto"
REFEITOS = INGEST / "refeitos_ditto"
ASSET_ROOT = ROOT / "assets" / "redacao" / "pdfs" / "20260905"
DATA_FILE = ROOT / "redacao-premium-feed-20260905.js"
DOC_FILE = ROOT / "docs" / "REDACAO_CAMADA_PREMIUM_20260905.md"
MANIFEST_FILE = ROOT / "docs" / "redacao-premium-feed-20260905-manifest.json"


DROPBOX_BONUS_URL = (
    "https://www.dropbox.com/scl/fo/ioz2sx5ctiz8vz5ppa5nf/"
    "AB9i5bHYSoDYXnMt1g1qb5Y?rlkey=vsycqjrar6ex70lwchdsoq881&dl=0"
)
DROPBOX_REFEITOS_URL = (
    "https://www.dropbox.com/scl/fo/yavh4d2al9qiui2j4d3g2/"
    "AEh8UYztJZRfQIrBwlDGHLw?rlkey=1ebl6lmsnp6d1hcce4xzj0akz&dl=0"
)

LIGATURES = str.maketrans(
    {
        "\ufb00": "ff",
        "\ufb01": "fi",
        "\ufb02": "fl",
        "\ufb03": "ffi",
        "\ufb04": "ffl",
        "\ufb05": "st",
        "\ufb06": "st",
        "\u00ad": "",
        "\u00a0": " ",
    }
)


@dataclass
class PdfAsset:
    source_path: Path
    public_path: str
    pages: int
    title: str
    kind: str
    themes: list[str]
    text: str


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_text).strip("-").lower()
    return ascii_text or "arquivo"


def normalize_pdf_text(value: str) -> str:
    value = unicodedata.normalize("NFKC", value or "")
    value = value.translate(LIGATURES)
    value = value.replace("MEGARREVISÃOENEM", "MEGARREVISÃO ENEM")
    value = value.replace("MEGARREVISÃO - ENEM", "MEGARREVISÃO ENEM")
    value = value.replace("daspessoas", "das pessoas")
    value = re.sub(r"\b([Aa]) a ([a-záàâãéêíóôõúç])", r"\1 \2", value)
    value = re.sub(r"\b([Aa]) os ([a-záàâãéêíóôõúç])", r"\1os \2", value)
    value = re.sub(r"\s+([,.;:?!])", r"\1", value)
    return value


def compact_text(value: str, limit: int | None = None) -> str:
    value = normalize_pdf_text(value)
    value = value.replace("\x00", " ")
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    value = re.sub(r" *\n *", "\n", value)
    value = value.strip()
    if limit and len(value) > limit:
        return value[: limit - 1].rstrip() + "..."
    return value


def sentence_text(value: str, limit: int = 360) -> str:
    value = normalize_pdf_text(value)
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"\s+([,.;:?!])", r"\1", value)
    if len(value) > limit:
        value = value[: limit - 1].rstrip() + "..."
    return value


def cut_at_contamination(value: str) -> str:
    triggers = [
        "PERGUNTA-GERADORA",
        "Pergunta-geradora",
        "Por que este recorte funciona",
        "RESULTADO DA AVALIAÇÃO",
        "RESULTADO DA VALID",
        "Classificação do recorte",
        "Classiﬁcação do recorte",
        "Validação inicial",
        "Proposta de redação",
    ]
    end = len(value)
    lower = value.lower()
    for trigger in triggers:
        pos = lower.find(trigger.lower())
        if pos >= 0:
            end = min(end, pos)
    return value[:end].strip(" .;\n")


def key(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-zA-Z0-9]+", " ", value).strip().lower()
    return value


def starts_with_label(line: str, label: str) -> bool:
    line_key = key(line)
    label_key = key(label)
    return line_key == label_key or line_key.startswith(f"{label_key} ")


def field_by_line(text: str, label: str, stops: list[str], limit: int = 420, max_lines: int = 8) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    stop_keys = [key(stop) for stop in stops]
    for index, line in enumerate(lines):
        if not starts_with_label(line, label):
            continue
        first = re.sub(rf"^{re.escape(label)}\\s*", "", line, flags=re.I).strip()
        if key(first) == key(label):
            first = ""
        chunk = [first] if first else []
        for next_line in lines[index + 1 : index + 1 + max_lines]:
            next_key = key(next_line)
            if any(next_key == stop or next_key.startswith(f"{stop} ") for stop in stop_keys):
                break
            if re.match(r"^(MEGARREVIS[AÃ]O|REDAÇÃO ENEM|Página|Prof\\. CAV)", next_line, re.I):
                break
            chunk.append(next_line)
        return sentence_text(cut_at_contamination(" ".join(chunk)), limit)
    return ""


def pretty_title(value: str) -> str:
    value = value.replace("_", " ").replace("-", " ")
    value = re.sub(r"\s+", " ", value).strip()
    replacements = {
        "Redacao": "Redação",
        "Bonus": "Bônus",
        "Infografico": "Infográfico",
        "Autonomia": "Autonomia",
        "Deficiencia": "Deficiência",
        "Fisica": "Física",
        "Mae": "Mãe",
        "Maes": "Mães",
        "Situacao": "Situação",
        "Vulnerabilidade": "Vulnerabilidade",
        "Socioeconomica": "Socioeconômica",
        "Entraves": "Entraves",
        "Reinsercao": "Reinserção",
        "Profissional": "Profissional",
        "Egressos": "Egressos",
        "Prisional": "Prisional",
        "Inclusao": "Inclusão",
        "Autistas": "Autistas",
        "Obstaculos": "Obstáculos",
        "Mobilidade": "Mobilidade",
        "Autonoma": "Autônoma",
        "Cidades": "Cidades",
        "Valorizacao": "Valorização",
        "Protecao": "Proteção",
        "Populacao": "População",
        "Espacos": "Espaços",
        "Publicos": "Públicos",
        "Moradia": "Moradia",
        "Digna": "Digna",
        "Ocupacoes": "Ocupações",
        "Urbanas": "Urbanas",
        "Direitos": "Direitos",
        "Entregadores": "Entregadores",
        "Aplicativo": "Aplicativo",
        "Educacao": "Educação",
        "Ribeirinha": "Ribeirinha",
        "Ditadura": "Ditadura",
        "Democracia": "Democracia",
        "Jovens": "Jovens",
        "Negros": "Negros",
        "Perifericos": "Periféricos",
        "Exploracao": "Exploração",
        "Criancas": "Crianças",
        "Adolescentes": "Adolescentes",
        "Digital": "Digital",
        "Populacoes": "Populações",
        "Marginalizadas": "Marginalizadas",
        "Acesso": "Acesso",
        "Justica": "Justiça",
        "Equidade": "Equidade",
        "Doacao": "Doação",
        "Orgaos": "Órgãos",
        "Recusa": "Recusa",
        "Familia": "Família",
        "Sistema": "Sistema",
        "Penitenciario": "Penitenciário",
        "Ressocializacao": "Ressocialização",
        "Privacidade": "Privacidade",
        "Seguranca": "Segurança",
        "Publicidade": "Publicidade",
        "Influenciadores": "Influenciadores",
        "Transito": "Trânsito",
        "Urbanizacao": "Urbanização",
        "Desordenada": "Desordenada",
        "Violencia": "Violência",
        "Juventude": "Juventude",
        "Generos": "Gêneros",
        "Musicais": "Musicais",
        "Idosos": "Idosos",
        "Analfabetismo": "Analfabetismo",
        "Funcional": "Funcional",
        "Comunicacao": "Comunicação",
        "Saude": "Saúde",
        "Desigualdade": "Desigualdade",
        "Docente": "Docente",
        "Evasao": "Evasão",
        "Sociais": "Sociais",
        "Agua": "Água",
        "Infancia": "Infância",
        "Opiniao": "Opinião",
        "Agraria": "Agrária",
        "Seguranca": "Segurança",
        "Publica": "Pública",
        "Periferias": "Periferias",
        "Gentrificacao": "Gentrificação",
        "Patrimonio": "Patrimônio",
        "Eleitoral": "Eleitoral",
        "Eleicoes": "Eleições",
        "Sustentavel": "Sustentável",
        "Alimentacao": "Alimentação",
        "Adequada": "Adequada",
        "Saudavel": "Saudável",
        "Saberes": "Saberes",
        "Tradicionais": "Tradicionais",
        "Indigenas": "Indígenas",
        "Climaticos": "Climáticos",
        "Extremos": "Extremos",
        "Democratizacao": "Democratização",
        "Cinema": "Cinema",
        "Manipulacao": "Manipulação",
        "Distancia": "Distância",
        "Curriculo": "Currículo",
        "Domestico": "Doméstico",
    }
    return " ".join(replacements.get(part, part) for part in value.split(" "))


def read_pdf(path: Path) -> tuple[str, int]:
    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return compact_text("\n".join(pages)), len(reader.pages)


def section_between(text: str, start: str, stops: list[str], limit: int = 420) -> str:
    lower = text.lower()
    start_index = lower.find(start.lower())
    if start_index < 0:
        return ""
    cursor = start_index + len(start)
    end_index = len(text)
    for stop in stops:
        stop_index = lower.find(stop.lower(), cursor)
        if stop_index >= 0:
            end_index = min(end_index, stop_index)
    return sentence_text(text[cursor:end_index], limit)


def copy_pdf(source: Path, namespace: str, title: str) -> str:
    target_dir = ASSET_ROOT / namespace
    target_dir.mkdir(parents=True, exist_ok=True)
    target_name = f"{slugify(title)}.pdf"
    target = target_dir / target_name
    shutil.copy2(source, target)
    return f"./assets/redacao/pdfs/20260905/{namespace}/{target_name}"


def title_from_filename(path: Path) -> str:
    name = path.stem
    name = re.sub(r"^\d+[_ -]+", "", name)
    return pretty_title(name)


def title_from_theme_folder(folder: Path) -> tuple[str, str]:
    match = re.match(r"Tema\s+(\d+)\s*-\s*(.+)", folder.name, re.I)
    if not match:
        return folder.name, slugify(folder.name)
    number = int(match.group(1))
    label = pretty_title(match.group(2))
    return f"Tema {number:02d} - {label}", f"tema-{number:02d}-{slugify(label)}"


def infer_theme_tags(text: str, title: str) -> list[str]:
    haystack = f"{title} {text}".lower()
    tags: list[str] = []
    vocab = {
        "educacao": "educação",
        "escolar": "educação",
        "saude": "saúde pública",
        "mental": "saúde mental",
        "digital": "tecnologia e cidadania",
        "internet": "tecnologia e cidadania",
        "idos": "envelhecimento",
        "crianca": "infância e adolescência",
        "adolesc": "infância e adolescência",
        "mulher": "gênero",
        "negro": "relações étnico-raciais",
        "racismo": "relações étnico-raciais",
        "perifer": "desigualdade territorial",
        "moradia": "direito à cidade",
        "transito": "segurança e mobilidade",
        "ambient": "meio ambiente",
        "climatic": "meio ambiente",
        "trabalho": "trabalho e cidadania",
        "cultura": "cultura e identidade",
        "cinema": "cultura e identidade",
        "lgbt": "direitos humanos",
        "justica": "direitos e justiça",
        "democracia": "democracia",
    }
    for key, label in vocab.items():
        if key in haystack and label not in tags:
            tags.append(label)
    return tags[:5] or ["redação ENEM", "repertório produtivo"]


def build_source_pack(asset: PdfAsset, source_label: str) -> dict:
    reading = field_by_line(
        asset.text,
        "Objetivo do material",
        ["Leitura crítica", "Leitura ampliada", "2.", "Página"],
        360,
        5,
    ) or field_by_line(
        asset.text,
        "Finalidade pedagógica",
        ["Leitura crítica", "Leitura ampliada", "2.", "Página"],
        360,
        5,
    )
    if not reading:
        reading = sentence_text(
            f"Leitura orientada do material {asset.title}: use o PDF completo como repertório, planejamento argumentativo e consulta de intervenção.",
            360,
        )

    essential = []
    for label in ["Problema central", "Tensão social", "Grupos mais afetados", "Direitos envolvidos"]:
        item = field_by_line(
            asset.text,
            label,
            ["Tensão social", "Grupos mais afetados", "Direitos envolvidos", "Risco de tangenciamento", "Tese possível", "Página"],
            220,
            4,
        )
        if item:
            essential.append(f"{label}: {item}")
    if not essential:
        essential = [
            "Material curado para repertório, tese, argumentação e intervenção.",
            "Use como consulta antes de escrever; não transforme em citação decorativa.",
            "Converta o repertório em causa, consequência ou proposta concreta.",
        ]

    return {
        "id": f"cav-20260905-{slugify(asset.kind)}-{slugify(asset.title)}",
        "title": asset.title,
        "type": asset.kind,
        "sourceLabel": source_label,
        "availability": f"PDF completo no app ({asset.pages} páginas)",
        "links": [{"label": "Abrir PDF", "url": asset.public_path}],
        "themes": asset.themes,
        "readingFocus": reading,
        "essentialPoints": essential[:4],
        "howToUse": "Use como consulta orientada: escolha um repertório, explique o mecanismo social e conecte à tese.",
        "examinerCare": "Evite decorar trechos. O ENEM premia repertório legitimado, pertinente e produtivo.",
        "closingPair": "Feche com política pública executável, agente claro e finalidade ligada ao problema.",
    }


def build_topic_pack(asset: PdfAsset, pack_id: str, title: str) -> dict:
    recorte = field_by_line(asset.text, "Recorte original do repertório-fonte", ["Sugestão em padrão ENEM"], 260, 5)
    sugestao = field_by_line(asset.text, "Sugestão em padrão ENEM", ["Justificativa da adequação"], 260, 5)
    justificativa = field_by_line(asset.text, "Justificativa da adequação", ["Tese de alta produtividade"], 340, 6)
    tese = field_by_line(asset.text, "Tese de alta produtividade", ["Prof. CAV", "Redação ENEM", "Página 2"], 560, 8)
    finalidade = (
        field_by_line(asset.text, "Finalidade pedagógica", ["Leitura ampliada", "Leitura crítica", "2."], 420, 7)
        or field_by_line(asset.text, "Objetivo do material", ["Leitura ampliada", "Leitura crítica", "2."], 420, 7)
    )
    problema = field_by_line(asset.text, "Problema central", ["Tensão social", "Raiz estrutural", "Grupos mais afetados"], 260, 5)
    grupos = field_by_line(asset.text, "Grupos mais afetados", ["Direitos envolvidos", "Risco de tangenciamento"], 240, 4)
    direitos = field_by_line(asset.text, "Direitos envolvidos", ["Risco de tangenciamento", "Tese possível", "Página"], 240, 4)
    risco = field_by_line(asset.text, "Risco de tangenciamento", ["Tese possível", "Redação ENEM", "Página"], 260, 4)
    palavras = field_by_line(asset.text, "Palavras-chave", ["Núcleo incontornável", "Redação ENEM", "Página"], 220, 4)

    theme = sugestao or recorte or title
    return {
        "id": pack_id,
        "title": title,
        "theme": theme,
        "sourcePdf": asset.public_path,
        "sourcePages": asset.pages,
        "competencyBoxes": [
            {
                "code": "C1",
                "title": "Precisão vocabular e norma culta",
                "focus": "Registro formal, vocabulário temático e frase limpa.",
                "text": sentence_text(
                    f"Para este tema, preserve norma culta e use vocabulário específico. Palavras-chave do material: {palavras or ', '.join(asset.themes)}. Evite oralidade, exagero emocional e frase pronta sem função argumentativa.",
                    520,
                ),
                "note": "O futuro médico precisa escrever com precisão: termo certo, sintaxe estável e tom formal.",
            },
            {
                "code": "C2",
                "title": "Recorte ENEM e repertório legitimado",
                "focus": "Compreender o tema sem tangenciar.",
                "text": sentence_text(
                    f"Recorte de trabalho: {theme}. {justificativa or 'O repertório deve comprovar o problema social, e não apenas enfeitar a introdução.'}",
                    620,
                ),
                "note": "O repertório só entra no plantão quando prova uma causa, consequência ou direito violado.",
            },
            {
                "code": "C3",
                "title": "Tese e projeto de texto",
                "focus": "D1 e D2 com funções diferentes.",
                "text": sentence_text(
                    tese
                    or f"Tese operacional: o problema decorre de barreiras estruturais e falhas institucionais que limitam direitos, exigindo resposta pública integrada. Problema central: {problema}",
                    700,
                ),
                "note": "Antes de escrever, confira se D1 e D2 sustentam a tese sem repetir o mesmo argumento.",
            },
            {
                "code": "C4",
                "title": "Progressão e costura",
                "focus": "Conectivos com função real.",
                "text": sentence_text(
                    f"Use a progressão clínica: primeiro nomeie a causa estrutural; depois mostre a falha de execução ou a naturalização cultural; por fim, retome o grupo afetado. {finalidade}",
                    620,
                ),
                "note": "C4 forte guia o avaliador: causa, efeito, retomada e avanço entre parágrafos.",
            },
            {
                "code": "C5",
                "title": "Intervenção de alta",
                "focus": "Agente, ação, meio, finalidade e detalhamento.",
                "text": sentence_text(
                    f"A intervenção deve responder ao recorte com agente público ou institucional, ação verificável, meio de execução, finalidade e detalhamento. Grupos afetados: {grupos or 'identifique o grupo vulnerabilizado no tema'}. Direitos envolvidos: {direitos or 'relacione ao direito social pertinente'}. Risco a evitar: {risco or 'conscientização genérica sem execução.'}",
                    700,
                ),
                "note": "A C5 precisa sair da boa intenção e virar conduta executável.",
            },
        ],
    }


def build_bonus_project_pack(asset: PdfAsset, pack_id: str, title: str) -> dict:
    recorte = (
        field_by_line(asset.text, "RECORTE TEMÁTICO", ["Classificação do recorte", "Classiﬁcação do recorte", "RESULTADO DA AVALIAÇÃO"], 280, 4)
        or field_by_line(asset.text, "RECORTE INTEGRAL", ["Classificação do recorte", "Classiﬁcação do recorte", "Delimitação conceitual"], 280, 4)
    )
    classificacao = (
        field_by_line(asset.text, "Classificação do recorte", ["Validação inicial"], 420, 7)
        or field_by_line(asset.text, "Classiﬁcação do recorte", ["Validação inicial"], 420, 7)
    )
    delimitacao = field_by_line(asset.text, "Delimitação nacional e social", ["Problema discutível"], 260, 4)
    intervencoes = field_by_line(asset.text, "Intervenções", ["Direitos humanos", "Adequação ao Ensino Médio"], 300, 4)
    direitos = field_by_line(asset.text, "Direitos humanos", ["Adequação ao Ensino Médio", "RESULTADO"], 320, 4)
    theme = recorte or title
    return {
        "id": pack_id,
        "title": title,
        "theme": theme,
        "sourcePdf": asset.public_path,
        "sourcePages": asset.pages,
        "competencyBoxes": [
            {
                "code": "C1",
                "title": "Vocabulário formal do recorte",
                "focus": "Nomear o problema sem oralidade.",
                "text": sentence_text(
                    f"Trate o recorte com linguagem precisa: {theme}. Evite fórmulas vagas como 'isso é um absurdo' e prefira mecanismos sociais, direitos, instituições e grupos afetados.",
                    520,
                ),
                "note": "A norma culta também aparece na escolha de palavras específicas para o problema.",
            },
            {
                "code": "C2",
                "title": "Validação temática",
                "focus": "Tema autoral compatível com padrão ENEM.",
                "text": classificacao
                or "O tema deve apresentar problema social brasileiro, possibilidade de tese, repertório legitimado e intervenção concreta.",
                "note": "O aluno deve provar que entendeu o recorte, não apenas o assunto geral.",
            },
            {
                "code": "C3",
                "title": "Delimitação e eixos",
                "focus": "Problema, causa e consequência.",
                "text": sentence_text(
                    delimitacao
                    or f"Construa D1 e D2 com causas diferentes para o tema: {theme}. Um eixo deve explicar a raiz do problema; o outro deve mostrar falha institucional, cultural ou territorial.",
                    620,
                ),
                "note": "Projeto de texto bom tem diagnóstico, não lista de opiniões.",
            },
            {
                "code": "C4",
                "title": "Sequência argumentativa",
                "focus": "Tópico frasal, explicação e fechamento.",
                "text": "Use tópico frasal claro no início de cada desenvolvimento, explique o mecanismo social e feche o parágrafo retomando o recorte. Não deixe repertório solto.",
                "note": "O texto precisa parecer consulta bem conduzida: cada parágrafo leva ao próximo.",
            },
            {
                "code": "C5",
                "title": "Conduta de intervenção",
                "focus": "Resposta pública completa.",
                "text": sentence_text(
                    f"Intervenções sugeridas pelo material: {intervencoes or 'defina agente, ação, meio, finalidade e detalhamento.'} Direitos humanos: {direitos or 'a proposta deve preservar dignidade, inclusão e proteção social.'}",
                    680,
                ),
                "note": "A proposta precisa ser possível, detalhada e ligada aos dois eixos do texto.",
            },
        ],
    }


def build_rubric_alerts() -> list[dict]:
    return [
        {
            "id": "ultimate-validacao-entrada-redacao",
            "code": "ETAPA 0",
            "title": "Validação antes da nota",
            "officialBasis": "Matriz e cartilha pública do ENEM: leitura segura antes de pontuar.",
            "studentCommand": "Confira tema, tipo dissertativo-argumentativo, legibilidade, completude, número de linhas e conclusão antes de pedir nota.",
            "avoid": "Não aceite diagnóstico baseado em trecho incompleto, foto ilegível ou tema ausente.",
            "trainingCheck": "Se a redação não puder ser lida com segurança, marque limitação e não transforme dúvida em erro real.",
        },
        {
            "id": "ultimate-triagem-nota-zero",
            "code": "ZERO",
            "title": "Triagem de nota zero",
            "officialBasis": "Regras públicas de anulação, fuga ao tema, tipo textual, insuficiência e ilegibilidade.",
            "studentCommand": "Antes de sofisticar repertório, garanta aderência total ao tema, estrutura dissertativa e proposta de intervenção respeitosa.",
            "avoid": "Não brinque com anulação deliberada, identificação indevida, impropérios ou texto desconectado.",
            "trainingCheck": "O texto responde ao recorte? Tem tese, desenvolvimento e intervenção? Está legível e completo?",
        },
        {
            "id": "ultimate-calibracao-c1-c5",
            "code": "C1-C5",
            "title": "Pontuação independente por competência",
            "officialBasis": "Cada competência vale até 200 pontos e deve ser avaliada separadamente.",
            "studentCommand": "Peça sempre a nota por C1, C2, C3, C4 e C5, com evidência textual e motivo de não atingir 200.",
            "avoid": "Não aceite nota total sem justificativa, nem competência inventada fora da escala 0, 40, 80, 120, 160 e 200.",
            "trainingCheck": "Some as cinco competências e confira se a justificativa de cada uma aponta uma ação concreta de melhora.",
        },
    ]


def build_c1_tips() -> list[dict]:
    return [
        {
            "id": "ultimate-c1-evidencia-antes-do-desconto",
            "title": "Erro real antes de desconto",
            "rule": "Toda crítica de C1 precisa nascer de ocorrência visível no texto do aluno.",
            "memory": "Não trate hipótese como diagnóstico: se a palavra não está legível, ela não vira erro certo.",
            "reason": "A correção premium preserva a redação original antes de apontar desvios de norma culta.",
            "sourceEssay": "Motor Redação CAV - protocolo de evidência.",
            "sourceExcerpt": "A avaliação deve seguir: afirmação, evidência, critério e conclusão.",
            "examples": [
                [
                    "Antes de marcar erro, copie mentalmente o trecho exato.",
                    "Se a foto estiver ilegível, registre limitação.",
                    "Se houver erro recorrente, mostre o padrão e ensine a correção.",
                    "Regra para lembrar: <rule>",
                ],
            ],
        },
        {
            "id": "ultimate-c1-periodo-economico-enem",
            "title": "Frase forte cabe em 30 linhas",
            "rule": "A melhoria proposta deve ser compatível com o espaço físico da redação ENEM.",
            "memory": "Não prescreva cinco repertórios para uma folha que só aceita uma redação.",
            "reason": "A redação real exige economia, precisão e transferência para a próxima produção.",
            "sourceEssay": "Motor Redação CAV - limite físico ENEM.",
            "sourceExcerpt": "Toda melhoria deve ser pedagógica, realista, econômica e compatível com o espaço do ENEM.",
            "examples": [
                [
                    "Troque parágrafo gigante por tese clara, dois eixos e intervenção completa.",
                    "Prefira repertório bem explicado a repertório numeroso.",
                    "A meta é aumentar nota na próxima redação, não escrever uma tese universitária.",
                    "Regra para lembrar: <rule>",
                ],
            ],
        },
    ]


def build_competency_examples() -> list[dict]:
    return [
        {
            "code": "C1",
            "title": "Norma culta com evidência",
            "rule": "C1 não é impressão: cite o desvio real, corrija e explique a regra.",
            "weak": "Há muitos erros gramaticais.",
            "strong": "Em 'devido a ausência', há problema de crase; prefira 'devido à ausência', pois 'devido a' encontra artigo feminino.",
        },
        {
            "code": "C3",
            "title": "Tese não basta",
            "rule": "D1 e D2 precisam provar a tese por caminhos diferentes.",
            "weak": "O aluno tem tese, então a argumentação está boa.",
            "strong": "A tese aponta negligência estatal e naturalização social; D1 precisa provar a negligência, e D2 precisa provar a naturalização.",
        },
        {
            "code": "C5",
            "title": "Intervenção executável",
            "rule": "A proposta deve ter agente, ação, meio, finalidade e detalhamento.",
            "weak": "O governo deve conscientizar a população.",
            "strong": "O MEC, em parceria com secretarias estaduais, deve ofertar oficinas de letramento midiático, por meio de materiais digitais e formação docente, para reduzir a circulação de desinformação entre estudantes.",
        },
    ]


def main() -> None:
    if not BONUS.exists() or not REFEITOS.exists():
        raise SystemExit("Pastas de ingestão não encontradas. Extraia os ZIPs antes de gerar a camada.")

    if ASSET_ROOT.exists():
        shutil.rmtree(ASSET_ROOT)
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    DOC_FILE.parent.mkdir(parents=True, exist_ok=True)

    assets: list[PdfAsset] = []
    source_packs: list[dict] = []
    premium_packs: list[dict] = []
    source_catalog: list[dict] = []

    for pdf in sorted((BONUS / "01_Projetos_de_Redacao").glob("*.pdf")):
        text, pages = read_pdf(pdf)
        title = title_from_filename(pdf).replace("Projeto Redação", "Projeto de Redação")
        public_path = copy_pdf(pdf, "projetos", title)
        asset = PdfAsset(pdf, public_path, pages, title, "Projeto de redação CAV", infer_theme_tags(text, title), text)
        assets.append(asset)
        premium_packs.append(build_bonus_project_pack(asset, f"cav-projeto-{slugify(title)}", title))
        source_packs.append(build_source_pack(asset, "Projeto de Redação CAV"))

    for pdf in sorted((BONUS / "02_Infograficos").glob("*.pdf")):
        text, pages = read_pdf(pdf)
        title = title_from_filename(pdf).replace("Infografico", "Infográfico")
        public_path = copy_pdf(pdf, "infograficos", title)
        asset = PdfAsset(pdf, public_path, pages, title, "Infográfico de repertório", infer_theme_tags(text, title), text)
        assets.append(asset)
        source_packs.append(build_source_pack(asset, "Infográfico CAV"))

    for pdf in sorted((BONUS / "03_Bonus_Extras").glob("*.pdf")):
        text, pages = read_pdf(pdf)
        title = title_from_filename(pdf).replace("Bonus Extra", "Bônus Extra").replace("Redacao", "Redação")
        public_path = copy_pdf(pdf, "bonus", title)
        asset = PdfAsset(pdf, public_path, pages, title, "Bônus estratégico de redação", infer_theme_tags(text, title), text)
        assets.append(asset)
        source_packs.append(build_source_pack(asset, "Bônus Redação CAV"))

    for folder in sorted([p for p in REFEITOS.iterdir() if p.is_dir()]):
        title, pack_id = title_from_theme_folder(folder)
        model_pdfs = sorted(folder.glob("Modelo *.pdf"))
        if not model_pdfs:
            continue
        chosen_pdf = next((p for p in model_pdfs if p.name == "Modelo 2.pdf"), model_pdfs[0])
        text, pages = read_pdf(chosen_pdf)
        public_paths = []
        for model_pdf in model_pdfs:
            model_text, model_pages = read_pdf(model_pdf)
            model_title = f"{title} - {model_pdf.stem}"
            public_path = copy_pdf(model_pdf, "temas-refeitos", model_title)
            public_paths.append({"label": model_pdf.stem, "url": public_path, "pages": model_pages})
            assets.append(
                PdfAsset(
                    model_pdf,
                    public_path,
                    model_pages,
                    model_title,
                    "Modelo de repertório por tema",
                    infer_theme_tags(model_text, model_title),
                    model_text,
                )
            )
        chosen_public = next((item["url"] for item in public_paths if item["label"] == "Modelo 2"), public_paths[0]["url"])
        asset = PdfAsset(chosen_pdf, chosen_public, pages, title, "Tema refeito UltimateENEM", infer_theme_tags(text, title), text)
        pack = build_topic_pack(asset, pack_id, title)
        pack["modelLinks"] = public_paths
        premium_packs.append(pack)
        source = build_source_pack(asset, "Modelos Refeitos UltimateENEM")
        source["links"] = [{"label": item["label"], "url": item["url"]} for item in public_paths]
        source_packs.append(source)

    for asset in assets:
        source_catalog.append(
            {
                "title": asset.title,
                "kind": asset.kind,
                "source_path": str(asset.source_path.relative_to(ROOT)),
                "public_path": asset.public_path,
                "pages": asset.pages,
                "themes": asset.themes,
            }
        )

    feed = {
        "meta": {
            "version": "20260905-redacao-premium-feed",
            "generatedAt": "2026-09-05",
            "project": "Ultimate ENEM CAV",
            "sourceFolders": [
                {"label": "Bonus_Redacao_Plano_Estudo_Enem", "url": DROPBOX_BONUS_URL},
                {"label": "REFEITOS ULTIMATEENEM", "url": DROPBOX_REFEITOS_URL},
            ],
            "souFederalMigratedLayer": [
                "triagem de nota zero",
                "pontuação independente C1-C5",
                "calibração por evidência textual",
                "relatório pedagógico enxuto",
                "preservação do original do aluno",
            ],
        },
        "premiumTopicPacks": premium_packs,
        "sourcePacks": source_packs,
        "rubricAlerts": build_rubric_alerts(),
        "c1Tips": build_c1_tips(),
        "competencyExamples": build_competency_examples(),
        "sourceCatalog": source_catalog,
        "correctionProtocol": {
            "identity": "Ultimate ENEM CAV",
            "nature": "estimativa pedagógica calibrada, não correção oficial do Inep",
            "authorityOrder": [
                "documentação pública vigente do INEP/ENEM",
                "redações oficiais nota 1000 divulgadas",
                "redações homologadas por especialistas",
                "corpus CAV de estudo e treino",
                "heurísticas internas",
            ],
            "requiredFlow": [
                "validar entrada",
                "transcrever se houver imagem",
                "triagem de nota zero",
                "radiografia tema-tese-D1-D2",
                "análise C1-C5 independente",
                "calibração com evidências",
                "relatório pedagógico aplicável",
            ],
        },
    }

    js = (
        "(() => {\n"
        "  const feed = "
        + json.dumps(feed, ensure_ascii=False, indent=2)
        + ";\n"
        "  const db = (window.REDACTION_DB = window.REDACTION_DB || {});\n"
        "  const upsertById = (field, items) => {\n"
        "    const current = Array.isArray(db[field]) ? db[field] : [];\n"
        "    const byId = new Map(current.map((item) => [item && item.id, item]));\n"
        "    for (const item of items || []) byId.set(item.id, item);\n"
        "    db[field] = Array.from(byId.values()).filter(Boolean);\n"
        "  };\n"
        "  upsertById('premiumTopicPacks', feed.premiumTopicPacks);\n"
        "  upsertById('sourcePacks', feed.sourcePacks);\n"
        "  upsertById('rubricAlerts', feed.rubricAlerts);\n"
        "  upsertById('c1Tips', feed.c1Tips);\n"
        "  upsertById('competencyExamples', feed.competencyExamples);\n"
        "  db.redacaoPremiumFeed20260905 = feed;\n"
        "  window.REDACTION_PREMIUM_FEED_20260905 = feed;\n"
        "})();\n"
    )
    DATA_FILE.write_text(js, encoding="utf-8")
    MANIFEST_FILE.write_text(json.dumps(feed["sourceCatalog"], ensure_ascii=False, indent=2), encoding="utf-8")

    doc = f"""# Camada Premium de Redação - 2026-09-05

Esta camada alimenta a aba Redação do Ultimate ENEM CAV com repertórios, projetos, infográficos e protocolos vindos dos dois pacotes Dropbox informados pelo Prof. CAV.

## Fontes autorizadas

- Bonus_Redacao_Plano_Estudo_Enem: {DROPBOX_BONUS_URL}
- REFEITOS ULTIMATEENEM: {DROPBOX_REFEITOS_URL}
- Motor Redação Sou Federal 2027 usado apenas como referência técnica interna para triagem, correção C1-C5, calibração e relatório pedagógico.

## O que foi gerado

- Arquivo de dados do app: `redacao-premium-feed-20260905.js`
- PDFs públicos do app: `assets/redacao/pdfs/20260905/`
- Manifesto técnico: `docs/redacao-premium-feed-20260905-manifest.json`

## Cobertura

- {len([p for p in premium_packs if p["id"].startswith("cav-projeto")])} projetos de redação.
- {len([p for p in premium_packs if p["id"].startswith("tema-")])} temas refeitos UltimateENEM.
- {len(source_packs)} fontes de leitura/repertório.
- {len(source_catalog)} PDFs catalogados.

## Regra de uso no app

O app usa trechos curtos e orientações por competência para consulta rápida. O PDF completo permanece acessível como fonte de aprofundamento. A correção de redação deve seguir a ordem: validação, transcrição quando houver imagem, triagem de nota zero, radiografia tema-tese-D1-D2, análise independente C1-C5, calibração por evidência e relatório pedagógico.

## Linguagem ao aluno

Toda saída visível deve manter norma culta, tom de orientação para futuros médicos e aviso de que a nota estimada é pedagógica, não oficial do Inep.
"""
    DOC_FILE.write_text(doc, encoding="utf-8")

    print(json.dumps({
        "premiumTopicPacks": len(premium_packs),
        "sourcePacks": len(source_packs),
        "sourceCatalog": len(source_catalog),
        "dataFile": str(DATA_FILE.relative_to(ROOT)),
        "docFile": str(DOC_FILE.relative_to(ROOT)),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
