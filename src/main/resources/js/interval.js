var Interval = function () {
    var arr = [];
    this.add = function (x1, x2) {
        if (!x2) x2 = x1;
        if (isNaN(x1) || isNaN(x2)) return 0;
        if (x1 > x2) {
            var x = x1;
            x1 = x2;
            x2 = x1;
        }

        var max = 0;
        var shadows = [];
        for (var i = 0; i < arr.length; i++) {
            if (x1 <= arr[i].x2 && x2 >= arr[i].x1) {
                max = Math.max(max, arr[i].m + 1);
                shadows.push(arr[i]);
            }
        }
        arr.push({x1: x1, x2: x2, m: max});
        return max;
    }
};

{
/*
    var testInterval = new Interval();
    console.log("0=" + testInterval.add(0.4, 0.8));
    console.log("1=" + testInterval.add(0.5, 0.5));
    console.log("2=" + testInterval.add(0.4, 0.7));
    console.log("1=" + testInterval.add(0.8, 0.9));
    console.log("0=" + testInterval.add(1, 1));
    console.log("1=" + testInterval.add(1, 1.1));
    console.log("2=" + testInterval.add(0.95, 1));
    console.log("3=" + testInterval.add(0, 1));
*/
}