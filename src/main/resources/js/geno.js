$(function () {
        $.get('geno.json').then(function (data) {
            init(data);
            draw();
        });

        var all = {}, parents = {};

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
                key = getParentKey(person);
                if (key && !parents[key]) {
                    parents[key] = person;
                }
            }
        }

        function getParentKey(person) {
            return (person.mother || person.father) ? JSON.stringify(
                {"mother": getId(person.mother), "father": getId(person.father)}) : null;
        }

        function getId(name) {
            return all[name] == null ? null : all[name].id;
        }

        function draw() {
            var key, person, nodes = [], edges = [];

            for (person in all) {
                if (all.hasOwnProperty(person)) {
                    nodes.push(all[person]);
                    person = all[person];
                    key = getParentKey(person);
                    if (key) {
                        edges.push({from: person.id, to: key, length: 20, width: 15});
                    }
                }
            }

            for (key in parents) {
                if (parents.hasOwnProperty(key)) {
                    nodes.push({id: key, label: ""});
                    if (parents[key].father) edges.push({from: parents[key].father, to: key, length: 1, width: 1});
                    if (parents[key].mother) edges.push({from: parents[key].mother, to: key, length: 1, width: 1});
                    if (parents[key].father && parents[key].mother) edges.push({from: parents[key].father, to: parents[key].mother, length: 2, width: 1});

                }
            }

            var container = document.getElementById('canvas');
            var data = {
                nodes: nodes,
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

    }
);

