// src/index.ts
import { h } from "preact";
var HEART_PATH = "M12 21s-6.7-4.35-9.3-8.1C1 10.5 1.4 7.2 4 5.6c2-1.2 4.4-.7 6 .9l2 2 2-2c1.6-1.6 4-2.1 6-.9 2.6 1.6 3 4.9 1.3 7.3C18.7 16.65 12 21 12 21z";
function LikeButtonComponent(_props) {
  const slug = String(_props.fileData?.slug ?? "");
  return h(
    "div",
    { class: "like-button-wrap" },
    h(
      "button",
      {
        type: "button",
        class: "like-button",
        "data-slug": slug,
        "aria-label": "Like this page"
      },
      h(
        "svg",
        {
          class: "like-icon",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24"
        },
        h("path", { d: HEART_PATH })
      ),
      h("span", { class: "like-count" }, "-")
    )
  );
}
var CSS_TEXT = [
  ".like-button-wrap {",
  "  display: flex;",
  "  justify-content: center;",
  "  margin: 1.5rem 0;",
  "}",
  ".page-footer .like-button-wrap {",
  "  justify-content: flex-start;",
  "  margin: 0.5rem 0 0 0;",
  "}",
  ".center > hr:has(+ .page-footer > .like-button-wrap:only-child) {",
  "  display: none;",
  "}",
  ".page-footer::after {",
  '  content: "";',
  "  display: block;",
  "  width: 100%;",
  "  height: 1px;",
  "  background-color: var(--lightgray);",
  "  margin: 1.5rem 0 0 0;",
  "}",
  ".like-button {",
  "  display: flex;",
  "  align-items: center;",
  "  gap: 0.4rem;",
  "  cursor: pointer;",
  "  padding: 0.4rem 0.9rem;",
  "  border-radius: 999px;",
  "  border: 1px solid var(--lightgray);",
  "  background: var(--light);",
  "  color: var(--darkgray);",
  "  font-family: inherit;",
  "  font-size: 0.9rem;",
  "  transition:",
  "    border-color 0.15s ease,",
  "    color 0.15s ease,",
  "    transform 0.1s ease;",
  "}",
  ".like-button:hover {",
  "  border-color: var(--secondary);",
  "  color: var(--secondary);",
  "}",
  ".like-button:active {",
  "  transform: scale(0.9);",
  "}",
  ".like-button .like-icon {",
  "  width: 18px;",
  "  height: 18px;",
  "  fill: none;",
  "  stroke: currentColor;",
  "  stroke-width: 1.6;",
  "  transition:",
  "    fill 0.15s ease,",
  "    stroke 0.15s ease;",
  "}",
  ".like-button.is-liked {",
  "  border-color: #e0566d;",
  "  color: #e0566d;",
  "}",
  ".like-button.is-liked .like-icon {",
  "  fill: #e0566d;",
  "  stroke: #e0566d;",
  "}",
  ".like-button .like-count {",
  "  min-width: 1ch;",
  "  font-variant-numeric: tabular-nums;",
  "}"
].join("\n");
var SCRIPT_LINES = [
  "function likeButtonSetup() {",
  "  var buttons = Array.prototype.slice.call(document.querySelectorAll('.like-button'))",
  "  if (buttons.length === 0) return",
  "  var slug = buttons[0].getAttribute('data-slug') || ''",
  "  if (!slug) return",
  "",
  "  function applyState(count, liked) {",
  "    buttons.forEach(function (btn) {",
  "      var countEl = btn.querySelector('.like-count')",
  "      if (countEl && typeof count === 'number') countEl.textContent = String(count)",
  "      if (liked) {",
  "        btn.classList.add('is-liked')",
  "      }",
  "    })",
  "  }",
  "",
  "  fetch('/api/like/' + encodeURIComponent(slug))",
  "    .then(function (res) { return res.json() })",
  "    .then(function (data) {",
  "      if (typeof data.count === 'number') applyState(data.count, false)",
  "    })",
  "    .catch(function () {})",
  "",
  "  function onClick() {",
  "    applyState(undefined, true)",
  "    fetch('/api/like/' + encodeURIComponent(slug), { method: 'POST' })",
  "      .then(function (res) { return res.json() })",
  "      .then(function (data) {",
  "        if (typeof data.count === 'number') applyState(data.count, true)",
  "      })",
  "      .catch(function () {})",
  "  }",
  "",
  "  buttons.forEach(function (btn) {",
  "    btn.addEventListener('click', onClick)",
  "    if (window.addCleanup) window.addCleanup(function () { btn.removeEventListener('click', onClick) })",
  "  })",
  "}",
  "",
  "document.addEventListener('nav', likeButtonSetup)"
].join("\n");
var LikeButton = () => {
  const component = LikeButtonComponent;
  component.css = CSS_TEXT;
  component.afterDOMLoaded = SCRIPT_LINES;
  return component;
};
export {
  LikeButton
};
