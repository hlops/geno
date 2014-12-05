$(function () {
        $.get('geno.json').then(function (data) {
            init(data);
            draw();
        });

        var all = {}, children = {}, husbands = {}, wifes = {}, orphans = [];

        var canvas = document.getElementById('canvas');
        var nodes = null;
        var edges = null;
        var graph = null;

        function init(arr) {
            var i, person, key;
            for (i = 0; i < arr.length; i++) {
                person = arr[i];
                if (!person.id) person.id = person.name;
                all[person.id] = person;
            }
            for (i = 0; i < arr.length; i++) {
                person = arr[i];
                key = getChildKey(person);
                if (!children[key]) {
                    children[key] = [];
                }
                children[key].push(person);

                if (person.mother && person.father) {
                    if (!wifes[person.father]) {
                        wifes[person.father] = {};
                    }
                    wifes[person.father][person.mother] = "";

                    if (!husbands[person.mother]) {
                        husbands[person.mother] = {};
                    }
                    husbands[person.mother][person.father] = "";
                }

                if (!person.mother && !person.father) {
                    orphans.push(person);
                }
            }
        }

        function getChildKey(person) {
            return JSON.stringify({"mother": person.mother, "father": person.father});
        }

        function draw() {
            var container = document.getElementById('mygraph');
            var data = {
                nodes: all,
                edges: edges
            };
            var options = {
                nodes: {
                    shape: 'dot'
                },
                edges: {
                    color: '#97C2FC'
                }
            };
            graph = new vis.Graph(container, data, options);
        }

        function drawPerson(person) {
            if (!person.isDrawn) {
                if (person)
                    person.isDrawn = true;

                var level = getLevel(person);
                var pos = getNextX(level);
                var x = 100 + pos * 50, y = 50 + level * 50;
                var rect = canvas.rect(30, 30).attr({ fill: '#f71' }).move(x, y);

                var pair = (person.gender == "M") ? wifes : husbands;
                drawPersons(person, pair[person.id]);
            }
        }

        function drawPersons(person, pairs) {
            if (pairs) {
                for (var p in pairs) {
                    if (pairs.hasOwnProperty(p)) {
                        drawPerson(all[p]);
                    }
                }
            }
        }

        function getLevel(person) {
            if (!person.level) {
                if (person.father) {
                    person.level = getLevel(all[person.father]) + 1;
                } else if (person.mother) {
                    person.level = getLevel(all[person.mother]) + 1;
                } else {
                    person.level = 0;
                }
            }
            return person.level;
        }

        var nextX = {};

        function getNextX(level) {
            if (nextX[level] == undefined) {
                nextX[level] = 0;
            } else {
                nextX[level] = nextX[level] + 1;
            }
            return nextX[level];
        }

    }
);

