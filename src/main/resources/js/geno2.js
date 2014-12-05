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

function init(data) {
    treeData = data;
    dataMap = data.reduce(function (map, node) {
        map[getId(node)] = node;
        node.couples = {};
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

function draw() {
    var width = 1500;
    var height = 600;

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

    node.append("circle")
        .attr("cx", function (d, i) {
            return i * 100;
        })
        .attr("cy", function (d, i) {
            return i * 40;
        })
        .attr("r", 5);

    node.append("text").text(function (d, i) {
        return d.name.split(" ")[1]
    })
        .attr("x", function (d, i) {
            return i * 100 + 12;
        })
        .attr("y", function (d, i) {
            return i * 40 + 4;
        })
}
