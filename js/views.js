var CarView = Backbone.View.extend({
    tagName: "img",
    className: "car",
    events: {
        "click": "changemodelauto",
    },
    changemodelauto: function () {
        //player = this.model;
        localStorage.setItem("car", this.model.get("code"))
        regame(0)
        // laps = 1
        // lapTime = []
        // startLap = new Date()
        // checkpoint_ = 1
    },
    render: function () {
        this.el.src = this.model.get("png");
        this.$el.css({
            'padding': '8px'
        });
        return this;
    }
});
var CarsView = Backbone.View.extend({
    el: "#cars",
    render: function () {
        _.each(this.model.models, function (item) {
            var car = new CarView({model: item})
            this.$el.append(car.render().el)
        }, this);
        return this;
    }
})
new CarsView({model: carCol}).render()