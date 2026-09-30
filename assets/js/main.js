(() => {
  "use strict";

  const doc = document;

  const reveals = doc.querySelectorAll("[data-reveal]");
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const inView = (el) => {
    const box = el.getBoundingClientRect();
    return box.top < window.innerHeight * 0.92 && box.bottom > 0;
  };

  if (reveals.length && "IntersectionObserver" in window && motionOk) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 45, 180)}ms`;
      if (inView(el)) el.classList.add("is-in");
      else io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const copyFallback = (value, done) => {
    const field = doc.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;top:0;left:-9999px";
    doc.body.appendChild(field);
    field.select();
    try { doc.execCommand("copy"); } catch {}
    field.remove();
    done();
  };

  doc.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.textContent;

    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-copy");

      const done = () => {
        btn.textContent = "copied";
        btn.dataset.copied = "1";
        window.setTimeout(() => {
          btn.textContent = label;
          delete btn.dataset.copied;
        }, 1500);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done, () => copyFallback(value, done));
      } else {
        copyFallback(value, done);
      }
    });
  });

  const clock = doc.querySelector("[data-clock]");
  if (clock) {
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    window.setInterval(tick, 1000);
  }
})();

(() => {
  "use strict";

  const doc = document;
  const term = doc.querySelector("[data-term]");
  if (!term || typeof term.showModal !== "function") return;

  const log = term.querySelector("[data-term-log]");
  const input = term.querySelector("[data-term-input]");
  const openers = doc.querySelectorAll("[data-term-open]");

  const history = [];
  let cursor = 0;
  let booted = false;

  const routes = {};
  const names = [];
  doc.querySelectorAll(".nav a").forEach((link) => {
    const slug = (link.getAttribute("href") || "").replace(/\.html$/, "");
    const key = (slug === "" || slug === "index") ? "home" : slug;
    routes[key] = link.getAttribute("href");
    names.push(key);
  });

  const BENCH = [
    "kernel/userspace    in progress   boots to a shell, scheduler rewrite in flight",
    "custom phone        bring-up      Pi prototype + chip logic, antenna still shy",
    "backend tooling     ongoing       small binaries, few deps, boring on purpose",
    "badminton + running seasonal      legs: fine. lungs: still negotiating.",
  ];

  const STACK = [
    "C++  Python  Go  Java        the working set",
    "Zig  C  Rust  asm            when the hardware gets an opinion",
    "TypeScript  SCSS  Bash  SQL  glue, in the good sense of the word",
  ];

  const write = (text, kind) => {
    const line = doc.createElement("p");
    line.className = "term__line" + (kind ? ` term__line--${kind}` : "");
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  };

  const writeCommand = (text) => {
    const line = doc.createElement("p");
    const prompt = doc.createElement("span");
    line.className = "term__line term__line--in";
    prompt.className = "term__ps1";
    prompt.textContent = "~ $";
    line.appendChild(prompt);
    line.appendChild(doc.createTextNode(` ${text}`));
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  };

  const writeBlock = (lines, kind) => lines.forEach((line) => write(line, kind));

  const go = (url, note) => {
    write(note || `→ ${url}`, "ok");
    window.setTimeout(() => { window.location.href = url; }, 180);
  };

  const commands = {
    help() {
      writeBlock([
        "help            this list",
        "whoami          short version of about.html",
        "ls              pages of this site",
        "cd <page>       also: goto / open <page>",
        "status          what is on the bench right now",
        "stack           what I actually write code in",
        "uname           system info, obviously",
        "clear           wipe the log",
        "exit            close (Esc does the same)",
      ], "out");
    },

    whoami() {
      writeBlock([
        "itzsnufis — systems & hardware developer.",
        "Writes C, C++, Zig, Go and a bit of assembly, plus an operating",
        "system nobody asked for. CachyOS, terminal-first, allergic to magic.",
      ], "out");
    },

    ls() {
      write(names.join("   "), "out");
    },

    cd(args) {
      let target = (args[0] || "").replace(/\.html$/, "");
      if (!target) return write("cd: missing argument — try `ls`", "err");
      if (target === ".." || target === "/" || target === "~") target = "home";
      if (!routes[target]) return write(`cd: no such route: ${target} — try \`ls\``, "err");
      go(routes[target]);
    },

    goto(args) { commands.cd(args); },

    open(args) {
      if (/^github/i.test(args[0] || "")) return go("https://github.com/itzsnufis");
      commands.cd(args);
    },

    status() { writeBlock(BENCH, "out"); },

    stack() { writeBlock(STACK, "out"); },

    uname() { write("itzsnufi 6.11-cachyos x86_64 GNU/Linux", "out"); },

    date() { write(new Date().toString(), "out"); },

    echo(args) { write(args.join(" "), "out"); },

    sudo() { write("nice try.", "err"); },

    clear() { log.innerHTML = ""; },

    exit() { term.close(); },
  };

  commands["?"] = commands.help;
  commands.quit = commands.exit;

  const submit = (raw) => {
    const line = raw.trim();
    writeCommand(line);
    if (!line) return;

    history.push(line);
    cursor = history.length;

    const [name, ...args] = line.split(/\s+/);
    const command = commands[name];

    if (typeof command === "function") command(args);
    else write(`command not found: ${name} — try \`help\``, "err");
  };

  const boot = () => {
    if (booted) return;
    booted = true;
    write("itzsnufi-shell 1.0 — keyboard only, because that is how it should be", "out");
    write("`help` lists the commands. `exit` pretends this never happened.", "out");
    write("", "out");
  };

  const show = () => {
    boot();
    term.showModal();
    input.value = "";
    window.setTimeout(() => input.focus(), 0);
  };

  openers.forEach((btn) => btn.addEventListener("click", (event) => {
    event.preventDefault();
    show();
  }));

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submit(input.value);
      input.value = "";
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      cursor = Math.max(0, cursor - 1);
      input.value = history[cursor] || "";
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      cursor = Math.min(history.length, cursor + 1);
      input.value = history[cursor] || "";
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      commands.clear();
    }
  });

  doc.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (term.open) term.close();
      else show();
    }
  });

  term.addEventListener("click", (event) => {
    const box = term.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right ||
                    event.clientY < box.top || event.clientY > box.bottom;

    if (outside) term.close();
    else input.focus();
  });
})();
