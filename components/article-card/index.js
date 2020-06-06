// components/article-card/index.js
Component({
  data: {
    pressState: false
  },  
  methods: {
    handleTouchStart() {
      this.setData({
        pressState: true
      })
    },
    handleTouchEnd() {
      this.setData({
        pressState: false
      })
    }
  }
})
