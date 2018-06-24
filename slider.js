/*
 * slider.js
 * Refernced: https://codepen.io/getreworked/pen/goQwPq
 */

// String Formatter Function
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

var $modal = $(".modal");
var $resultString = $("#result-string");
var $emailTarget = $("#emailTarget");

function copyToClipboard() {
    var copyText = $resultString;
    navigator.clipboard.writeText(copyText.html().replace(/<br>/gi, "\n")).then(function() {
        alert("내용이 복사되었습니다.\nrecruit@ebrain.kr로 보내주세요!");
    }, function(err) {
        alert("복사에 실패했습니다. 직접 복사해서 보내주세요!");
    });
}

function sendByEmail() {
    var mail = document.getElementById("emailTarget");
    var dict = {
        subject: "직업 선택 중요 요소 계산 결과",
        body: $resultString.html().replace(/<br>/gi, "%0D%0A")
    };
    mail.href = "mailto:recruit@ebrain.kr?subject={subject}&body={body}".formatUnicorn(dict);
    mail.click();
}

var app = new Vue({
  el: '#app',
  data: {
      name: "",
      email: "",
      phone: "",
      max: 100,
      min: 0,
      resultString: "",
      selectedAnswer: [],
      sliderName: [
          "출퇴근 거리 (위치)", "보상", "회사 안정성", "기업 문화",
          "회사의 성장 가능성", "개발자로써의 성장 가능성", "복지",
          "근무 형태 (칼퇴, 재택 근무 등)", "업무 적합성 (내게 맞는 일인가?)", "기타"
      ],
      Sliders: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  },
  computed: {

  },
  methods: {
      // Slider 변경 이벤트 핸들러
      changeSlider(slider) {
          const sum = this.Sliders.reduce((sum, val) => sum + val, 0);
          const diff = sum - 100;
          let remainder = 0
          let arr = [];

          // Slider 무빙 처리
          for (let i in this.Sliders) {
              if (i != slider) { // 드래그 중인 Slider는 계산하지 않음
                  let val = this.Sliders[i] - diff / (this.Sliders.length - 1)
                  if (val < 0) {
                      remainder += val
                      val = 0
                  }
                  this.$set(this.Sliders, i, val)

              }
          }

          // 나머지 처리
          if (remainder) {
              const filteredLength = this.Sliders.filter((val, key) => val > 0 && key != slider).length
              for (let i in this.Sliders) {
                  if (i != slider && this.Sliders[i] > 0) {
                      this.$set(this.Sliders, i, this.Sliders[i] + remainder / filteredLength)
                  }

              }
          }

          // 전체 input 태그에 수정 사항 반영
          this.$emit('input', this.Sliders)

          // 반올림한 값으로 적용
          for (let i in this.Sliders) {
              arr.push(Math.round(this.Sliders[i]))
              this.selectedAnswer = arr;
          }

          this.makeData();
      },
      makeData() {
          var context = this;
          var result = "직업 선택 중요도 조사<br>{name}: {phone}: {email}<br>".formatUnicorn({
            name: this.name,
            phone: this.phone,
            email: this.email 
          });;

          this.Sliders.forEach(function (value, index, array) {
            result += "" + (index + 1) + ". " + context.sliderName[index] + ": " + value.toFixed(1) + "%<br>";
          });
          
          this.resultString = result;
      },
      calculate() {
          if (this.name == "") {
              alert("이름을 입력해주십시오.");
              return;
          }

          if (this.email == "") {
              alert("E-mail을 입력해주십시오.");
              return;
          }

          if (this.phone == "") {
              alert("휴대폰 번호를 입력해주십시오.");
              return;
          }
          $resultString.html(this.resultString);
          $modal.modal("show");
      }
  }
});