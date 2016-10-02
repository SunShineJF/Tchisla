(function () {
  'use strict';
  var sys = {
      dataPath: 'data/',
      dataBest: 'best.dat',
      dataSolutions: 'solution.%n.dat',
      answer: [],
      $solutions: document.getElementById('solutions'),
      $answer: document.getElementById('answer'),
      $last: document.getElementById('last'),
      $next: document.getElementById('next'),
      $quiz: document.getElementById('quiz'),
      $formula: document.getElementById('formula'),
      $solution: document.getElementById('solution'),
      getName: function (n) {
        return sys.dataSolutions.replace(/%n/, (n - 1) / 50 | 0)
      }
    },
    tchisla = window.tchisla = {
      getData: function (file, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', sys.dataPath + file, true);
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            console.log('file load success', file);
            sys[file] = request.responseText;
            callback(sys[file]);
          }
        };
        request.send();
      },

      parseData: function (dataSolution) {
        var solutionArr = dataSolution.split(/[\n\r]+/);
        solutionArr.forEach(function (data) {
          if (data.match(/^(\d+)#(\d+) ([√^!+\-*/\d\(\)]+)$/)) {
            var targetNum = RegExp.$1, baseNum = RegExp.$2, answer = RegExp.$3;
            sys.answer[targetNum] = sys.answer[targetNum] || [];
            sys.answer[targetNum][baseNum] = answer;
          }
        });
      },

      preparePad: function () {
        var bestArr = sys[sys.dataBest].split(/[\n\r]+/);
        bestArr.forEach(function (line, y) {
          var tr = document.createElement('tr'), td = document.createElement('td');
          td.setAttribute('class', 'row');
          td.innerText = y + 1;
          tr.appendChild(td);
          for (var x = 0; x <= 8; x++) {
            td = document.createElement('td');
            td.setAttribute('rel', (y + 1) + '#' + (x + 1));
            td.innerText = parseInt(line[x], 36);
            tr.appendChild(td);
          }
          sys.$solutions.appendChild(tr);
        });
      },
      showAnswer: function (targetNum, baseNum) {
        sys.$answer.style.display = 'block';
        sys.$quiz.innerText = targetNum + '#' + baseNum;
        sys.$solution.innerText = targetNum + '=' + sys.answer[targetNum][baseNum];
      },
      render: function () {
        tchisla.getData(sys.dataBest, tchisla.preparePad);
        sys.$solutions.addEventListener('click', function (e) {
          var quiz = e.target.getAttribute('rel');
          if (!quiz) { return; }
          var temp = quiz.split('#'), targetNum = +temp[0], baseNum = +temp[1];
          if (!sys[sys.getName(targetNum)]) {
            tchisla.getData(sys.getName(targetNum), tchisla.parseData);
          }
          tchisla.showAnswer(targetNum, baseNum);
        });
        sys.$answer.addEventListener('click', function (e) {
          if (e.target.id === 'last') {
          } else if (e.target.id === 'next') {
          } else {
            sys.$answer.style.display = 'none';
          }
        });
      }
    };
  tchisla.render();
})();