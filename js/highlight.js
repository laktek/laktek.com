import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import go from "highlight.js/lib/languages/go";
import shell from "highlight.js/lib/languages/shell";
import vim from "highlight.js/lib/languages/vim";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("go", go);
hljs.registerLanguage("vim", vim);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("json", json);

hljs.highlightAll();
