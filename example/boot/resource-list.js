var resourceList = [

{ id : "robotFolder/arm_hand", src:"res/robotFolder/arm_hand.png"},
{ id : "robotFolder/arm_lower", src:"res/robotFolder/arm_lower.png"},
{ id : "robotFolder/arm_upper", src:"res/robotFolder/arm_upper.png"},
{ id : "robotFolder/head", src:"res/robotFolder/head.png"},
{ id : "robotFolder/leg_foot", src:"res/robotFolder/leg_foot.png"},
{ id : "robotFolder/leg_lower", src:"res/robotFolder/leg_lower.png"},
{ id : "robotFolder/leg_upper", src:"res/robotFolder/leg_upper.png"},
{ id : "robotFolder/lowerbody", src:"res/robotFolder/lowerbody.png"},
{ id : "robotFolder/upperbody", src:"res/robotFolder/upperbody.png"},



{
    id: "signIn",
    type: "fn",
    fn: function(loader, queue) {
        var Me = this;
        this.finished = true;
    },
    update: function() {

    },
    isFinished: function() {
        return this.finished;
    }
}, ];

var audioList = [

];
