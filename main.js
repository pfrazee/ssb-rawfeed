var pull = require('pull-stream')

// render base structure
document.body.innerHTML = [
  'filter (eg value.sequence == 1, content.type == \'post\')<br>',
  '<input id="filter" style="display:block;width:100%;margin:5px;border: 1px solid #ccc">',
  'render (eg JSON.stringify(msg), content.type)<br>',
  '<textarea id="render" style="display:block;width:100%;margin:5px;border: 1px solid #ccc"></textarea>',
  '<div id="log"></div>'
].join('')
renderlog()

filter.addEventListener('keydown', function (e) {
  if (e.keyCode == 13)
    renderlog()
})
filter.addEventListener('blur', renderlog)
render.addEventListener('blur', renderlog)

function renderlog () {
  log.innerHTML = ''
  pull(
    ssb.createLogStream(),
    pull.filter(function (msg) {
      var code = filter.value
      if (!code) return true

      var key = msg.key
      var value = msg.value
      var content = value.content
      var author = value.author
      var seq = value.sequence
      var sequence = seq
      return eval(code)
    }),
    pull.drain(function (msg) {
      var el = document.createElement('pre')
      var html = ''

      var code = render.value
      if (code) {
        var key = msg.key
        var value = msg.value
        var content = value.content
        var author = value.author
        var seq = value.sequence
        var sequence = seq
        html = eval(code)
      } else {
        html = JSON.stringify(msg, null, 2)
      }
      el.innerHTML = html
      log.appendChild(el)
    })
  )
}