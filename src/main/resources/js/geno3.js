$(function () {
    $.get('geno.json').then(function (data) {
        init(data);
        draw();
    });
});

var dataMap = {};
var people = [];
var couples = [], couplesMap = {};
var children = [];

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

function getNodeOrder(id) {
    var node = getNode(id);
    return node ? node.order : null;
}

function init(data) {
    dataMap = data.reduce(function (map, node) {
        var id = getId(node);
        node.order = people.length;
        people.push(node);
        map[id] = node;
        node.birth = parseDate(node.birth);
        node.death = parseDate(node.death);
        var heightRange = getHeightRange(node);
        minHeightRange = minHeightRange ? Math.min(minHeightRange, heightRange) : heightRange;
        maxHeightRange = maxHeightRange ? Math.max(maxHeightRange, heightRange) : heightRange;
        return map;
    }, {});
    data.forEach(function (node) {
        node.yy = getHeight(node);
        var parentKey = getParentKey(node);
        var couple = {
            source: getNodeOrder(node.mother),
            target: getNodeOrder(node.father)
        };
        if (couple.source == null) {
            couple.source = couple.target;
        }
        if (couple.target == null) {
            couple.target = couple.source;
        }
        if (couple.target != null) {
            couplesMap[parentKey] = couple;
            children.push({
                source: couple.target,
                target: getNodeOrder(getId(node))
            });
        }
    });
    d3.values(couplesMap).forEach(function (i) {
        couples.push(i);
    });

    children.forEach(function (i) {
        console.log(i)
    })
}

var width = 1500;
var height = 800;
var minHeightRange, maxHeightRange;

function getHeight(d) {
    return height * (getHeightRange(d) - minHeightRange) / (maxHeightRange - minHeightRange + 1) * .9 + 50;
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

    vis.append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    var force = d3.layout.force()
        .size([width, height])
        .nodes(people)
        .links(couples.concat(children))
        .linkDistance(50)
        .charge(-1000)
        .on("tick", tick)
        .start();

    var groups = outer.selectAll("circle").data(people).enter().append("g").append("svg");
    var nodes = groups.append("circle").attr("r", 10).attr("cx", 11).attr("cy", 15);

    var links = outer.selectAll("link").data(couples).enter().append("line").attr("class", "link");
    var child_links = outer.selectAll("link").data(children).enter().append("line").attr("class", "link1");

    groups.append("text").text(function (d) {
        return d.name.split(" ")[1];
    }).attr("x", 22).attr("y", 19);


    function tick() {
        links
            .attr("x1", function (d) {
                return d.source.x + 10;
            })
            .attr("y1", function (d) {
                return d.source.yy + 15;
            })
            .attr("x2", function (d) {
                return d.target.x + 10;
            })
            .attr("y2", function (d) {
                return d.target.yy + 15;
            });

        groups
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.yy;
            })
            .attr("w", 200).attr("h", 50);

        child_links.attr("x1", function (d) {
            return getChildCoord(d).x + 10;
        })
            .attr("y1", function (d) {
                return getChildCoord(d).yy + 15;
            })
            .attr("x2", function (d) {
                return d.target.x + 10;
            })
            .attr("y2", function (d) {
                return d.target.yy + 15;
            });

    }

    function getChildCoord(d) {
        if (d.target.mother && d.target.father) {
            return {
                x: (getNode(d.target.mother).x + getNode(d.target.father).x) / 2,
                yy: (getNode(d.target.mother).yy + getNode(d.target.father).yy) / 2
            }
        } else return d.source;
    }
}
