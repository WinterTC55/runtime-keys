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

function links(runtimeKey) {
	let str = '';
	if (runtimeKey.website) {
		str += `<br><a href="${escapeHtml(runtimeKey.website)}">Website</a>`
	}
	if (runtimeKey.repository) {
		str += `<br><a href="${escapeHtml(runtimeKey.repository)}">Repository</a>`
	}
	return str;
}

const rows = runtimes
// intentional whitespace so output is human readable
	.map((r) => `          <tr>
            <td><code>${escapeHtml(r.key)}</code></td>
            <td>${escapeHtml(r.organization)} / ${escapeHtml(r.name)}</td>
            <td>${escapeHtml(r.description)}${links(r)}</td>
          </tr>`
	)
	.join("\n");
const injected = spec.replace("          <!-- RUNTIME_KEYS_ROWS -->", rows);

writeFileSync(outPath, injected, "utf8");
