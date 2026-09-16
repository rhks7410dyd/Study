;(function () {
  var MARKERS = [
    { prefix: "🧩", kind: "origin" },
    { prefix: "✅", kind: "solve" },
    { prefix: "📝", kind: "note" },
    { prefix: "📄", kind: "code" },
  ]

  function markerFor(h2) {
    var text = h2.textContent.trim()
    for (var i = 0; i < MARKERS.length; i++) {
      if (text.indexOf(MARKERS[i].prefix) === 0) return MARKERS[i]
    }
    return null
  }

  function tabify(article) {
    if (!article || article.dataset.practiceTabified === "1") return
    var headings = Array.prototype.filter.call(article.querySelectorAll("h2"), function (h2) {
      return markerFor(h2) !== null
    })
    if (headings.length < 2) return
    article.dataset.practiceTabified = "1"

    var container = document.createElement("div")
    container.className = "practice-tabs"
    var tabBar = document.createElement("div")
    tabBar.className = "practice-tab-bar"
    var panelsWrap = document.createElement("div")
    panelsWrap.className = "practice-tab-panels"

    headings[0].parentNode.insertBefore(container, headings[0])
    container.appendChild(tabBar)
    container.appendChild(panelsWrap)

    headings.forEach(function (h2, idx) {
      var marker = markerFor(h2)
      var label = h2.textContent.replace(marker.prefix, "").trim()

      var btn = document.createElement("button")
      btn.type = "button"
      btn.className = "practice-tab-btn" + (idx === 0 ? " active" : "")
      btn.innerHTML =
        '<span class="practice-tab-icon">' + marker.prefix + "</span><span>" + label + "</span>"
      tabBar.appendChild(btn)

      var panel = document.createElement("div")
      panel.className = "practice-tab-panel" + (idx === 0 ? " active" : "")
      panel.dataset.kind = marker.kind

      var node = h2.nextSibling
      var toMove = []
      var boundary = headings[idx + 1] || null
      h2.remove()
      while (node && node !== boundary) {
        var next = node.nextSibling
        toMove.push(node)
        node = next
      }
      toMove.forEach(function (n) {
        panel.appendChild(n)
      })
      panelsWrap.appendChild(panel)

      btn.addEventListener("click", function () {
        tabBar.querySelectorAll(".practice-tab-btn").forEach(function (b) {
          b.classList.remove("active")
        })
        panelsWrap.querySelectorAll(".practice-tab-panel").forEach(function (p) {
          p.classList.remove("active")
        })
        btn.classList.add("active")
        panel.classList.add("active")
      })
    })
  }

  function run() {
    document.querySelectorAll(".markdown-preview-view").forEach(tabify)
  }

  document.addEventListener("nav", run)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run)
  } else {
    run()
  }
})()
