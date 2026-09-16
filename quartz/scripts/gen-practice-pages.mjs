// Practice/<Lang>/<folder>/ 안의 note.md + problem-origin.* + problem-solve.* (또는
// 그 폴더의 유일한 코드 파일)를 하나의 index.md로 합쳐서, 그래프/탐색기에 폴더당
// 노드 하나만 뜨도록 만든다. note.md/코드 파일 자체는 원본 그대로 유지되고(사람이 계속
// 그 파일들을 직접 편집), 이 스크립트는 매 build/serve 전에 다시 읽어서 합친다.
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import path from "path"

const VAULT_DIR = path.resolve(import.meta.dirname, "..", "..", "vault")
const PRACTICE_DIR = path.join(VAULT_DIR, "Practice")
const LANG_BY_EXT = { ".py": "python", ".java": "java" }

function listDirs(dir) {
  return readdirSync(dir).filter((e) => statSync(path.join(dir, e)).isDirectory())
}

function demoteHeadings(md) {
  let inFence = false
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence
      if (inFence) return line
      return line.replace(/^(#{1,5})(\s)/, (_, hashes, sp) => "##" + hashes + sp)
    })
    .join("\n")
}

function codeBlock(lang, code) {
  return "```" + lang + "\n" + code.replace(/\r\n/g, "\n").trimEnd() + "\n```\n"
}

let pagesGenerated = 0

for (const lang of listDirs(PRACTICE_DIR)) {
  const langDir = path.join(PRACTICE_DIR, lang)
  const problemFolders = listDirs(langDir).filter((folder) =>
    readdirSync(path.join(langDir, folder)).some((e) => e.toLowerCase() === "note.md"),
  )

  // 폴더 자동 인덱스 페이지(.../index)는 Quartz의 링크-추출기가 "index" 접미사를 항상 잘라버려서
  // contentIndex의 실제 키와 안 맞아 그래프 엣지가 안 생긴다. 대신 그래프에서 정상 연결되는
  // "진짜" 콘텐츠 페이지(README.md)를 상위 참조 타겟으로 자동 생성해둔다.
  const langReadme =
    `---\ntitle: "${lang}"\n---\n\n` +
    `상위: [[Practice/README|Practice]]\n\n` +
    `## ${lang} 문제 목록\n\n` +
    problemFolders.map((f) => `- [[Practice/${lang}/${f}/index|${f}]]`).join("\n") +
    "\n"
  writeFileSync(path.join(langDir, "README.md"), langReadme)

  for (const folder of listDirs(langDir)) {
    const dir = path.join(langDir, folder)
    const entries = readdirSync(dir)
    const notePath = entries.find((e) => e.toLowerCase() === "note.md")
    if (!notePath) continue // note.md 없는 폴더(=Practice 문제 폴더가 아님)는 건드리지 않음

    const codeFiles = entries.filter((e) => LANG_BY_EXT[path.extname(e).toLowerCase()])
    if (codeFiles.length === 0) continue

    const origin = codeFiles.find((e) => /^problem-origin\./i.test(e))
    const solve = codeFiles.find((e) => /^problem-solve\./i.test(e))
    const rest = codeFiles.filter((e) => e !== origin && e !== solve).sort()
    const orderedCodeFiles = [origin, solve, ...rest].filter(Boolean)

    const noteContent = readFileSync(path.join(dir, notePath), "utf-8")

    let md = `---\ntitle: "${folder}"\n---\n\n`
    md += `상위: [[Practice/${lang}/README|${lang}]] · [[Practice/README|Practice]]\n\n`
    md += `<link rel="stylesheet" href="/static/practice-tabs.css">\n\n`

    for (const file of orderedCodeFiles) {
      const ext = path.extname(file).toLowerCase()
      const lang2 = LANG_BY_EXT[ext]
      const code = readFileSync(path.join(dir, file), "utf-8")
      const label = file === origin ? "🧩 " + file : file === solve ? "✅ " + file : "📄 " + file
      md += `## ${label}\n\n${codeBlock(lang2, code)}\n`
    }

    md += `## 📝 note.md\n\n${demoteHeadings(noteContent).trim()}\n\n`
    md += `<script src="/static/practice-tabs.js" defer></script>\n`

    writeFileSync(path.join(dir, "index.md"), md)
    pagesGenerated++
  }
}

console.log(`[gen-practice-pages] ${pagesGenerated}개 Practice 탭 페이지 생성 완료`)
