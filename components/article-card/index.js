// components/article-card/index.js
Component({
  data: {
    pressState: false
  },  
  methods: {
    handleTouchStart() {
      this.triggerEvent("touchchange", true);
      this.setData({
        pressState: true
      })
    },
    handleTouchEnd() {
      this.triggerEvent("touchchange", false);
      this.setData({
        pressState: false
      })
    }
  }
})
