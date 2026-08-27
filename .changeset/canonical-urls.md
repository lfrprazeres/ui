---
"@lfrprazeres/ui": patch
---

Point `homepage` at the live docs. It referenced `ui.luizprazeres.dev`, a
domain that was never registered, so the Homepage link on the npm page
resolved to a DNS error. It now points at `lfrprazeres.dev/ui`.
