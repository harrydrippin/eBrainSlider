/*
 * slider.js
 * Refernced: https://codepen.io/getreworked/pen/goQwPq
 */

var app = new Vue({
  el: '#app',
  data: {
      max: 100,
      min: 0,
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
      }
  }
});