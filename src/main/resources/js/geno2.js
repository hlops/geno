$(function () {
    $.get('geno.json').then(function (data) {
        init(data);
        draw();
    });
});

var dataMap = {};
var treeData = [];

function getId(node) {
    return node.id || node.name;
}

function getNode(id) {
    return dataMap[id] || "";
}

function getParentKey(node) {
    var father = getNode(node.father);
    var mother = getNode(node.mother);
    return (father || mother) ? getId(father) + "_" + getId(mother) : null;
}

function setCouple(node, parentKey, child) {
    node.couples[parentKey] = child;
}

function parseDate(d) {
    if (d) {
        var s = d.split("-");
        return new Date(parseInt(s[2]), parseInt(s[1]) - 1, parseInt(s[0]) + 1);
    }
    return null;
}

function getDate(d) {
    return d ? d.toLocaleDateString() : "";
}

function init(data) {
    treeData = data;
    dataMap = data.reduce(function (map, node) {
        map[getId(node)] = node;
        node.couples = {};
        node.birth = parseDate(node.birth);
        node.death = parseDate(node.death);
        var heightRange = getHeightRange(node);
        minHeightRange = minHeightRange ? Math.min(minHeightRange, heightRange) : heightRange;
        maxHeightRange = maxHeightRange ? Math.max(maxHeightRange, heightRange) : heightRange;
        return map;
    }, {});
    data.forEach(function (node) {
        var parentKey = getParentKey(node);
        if (node.mother) {
            setCouple(getNode(node.mother), parentKey, node);
        }
        if (node.father) {
            setCouple(getNode(node.father), parentKey, node);
        }
    });
}

var width = 1500;
var height = 800;
var minHeightRange, maxHeightRange;

function getHeight(d) {
    return height * (getHeightRange(d) - minHeightRange) / (maxHeightRange - minHeightRange + 1) * .9+50;
}

function getHeightRange(d) {
    return d.birth ? d.birth.getFullYear() : (minHeightRange + maxHeightRange) / 2;
}

function draw() {

    var outer = d3.select("#canvas")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all");

    var vis = outer
        .append('svg:g');

    /*
     vis.append('svg:rect')
     .attr('width', width)
     .attr('height', height)
     .attr('fill', 'white');

     */
    /*
     var force = d3.layout.force()
     .size([width, height])
     .nodes([{}]) // initialize with a single node
     .linkDistance(50)
     .charge(-200);
     */

    var node = outer.selectAll("circle").data(treeData).enter().append("g");

    var intervals = new Interval();
    var intervals1 = new Interval();
    node.append("circle")
        .attr("cx", function (d) {
            var h = getHeight(d);
            return 50 + intervals.add(h - 10, h + 10) * 200;
        })
        .attr("cy", function (d) {
            return getHeight(d);
        })
        .attr("r", 5);

    node
        .append("text").text(function (d, i) {
            //return d.name.split(" ")[1]
            return d.name.split(" ")[1] + " " + getDate(d.birth) + getHeightRange(d);
        })
        .attr("x", function (d) {
            var h = getHeight(d);
            return 50 + intervals1.add(h - 10, h + 10) * 200 + 8;
        })
        .attr("y", function (d) {
            return getHeight(d) + 4;
        })
}
