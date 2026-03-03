import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const specPath = resolve(import.meta.dirname, "spec.html");
const dataPath = resolve(import.meta.dirname, "runtime-keys.json");
const outPath = resolve(import.meta.dirname, "spec-injected.html");

const spec = readFileSync(specPath, "utf8");
const { runtimes } = JSON.parse(readFileSync(dataPath, "utf8"));

function escapeHtml(str) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

const rows = runtimes
// intentional whitespace so output is human readable
	.map((r) => `          <tr>
            <td>${escapeHtml(r.organization)}</td>
            <td>${escapeHtml(r.name)}</td>
            <td><code>${escapeHtml(r.key)}</code></td>
            <td>${escapeHtml(r.description)}</td>
            <td>${r.website ? `<a href="${escapeHtml(r.website)}">Website</a>` : "-"}</td>
            <td>${r.repository ? `<a href="${escapeHtml(r.repository)}">Repository</a>` : "-"}</td>
          </tr>`
	)
	.join("\n");
const injected = spec.replace("          <!-- RUNTIME_KEYS_ROWS -->", rows);

writeFileSync(outPath, injected, "utf8");
