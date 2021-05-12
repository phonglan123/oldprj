var data = spinDatabase,
    padding = {
        top: 20,
        right: 40,
        bottom: 0,
        left: 0
    },
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    color = d3.scale.category20(),
    svg = d3.select('#chart').append("svg").data([data]).attr("width", w + padding.left + padding.right).attr("height", h + padding.top + padding.bottom),
    container = svg.append("g").attr("class", "chartholder").attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"),
    vis = container.append("g"),
    pie = d3.layout.pie().sort(null).value(d => 1),
    arc = d3.svg.arc().outerRadius(r),
    arcs = vis.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");

arcs.append("path").attr("fill", (d, i) => color(i)).attr("d", d => arc(d));
arcs.append("text").attr("transform", d => {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
}).attr("text-anchor", "end").text((d, i) => data[i].label);
container.on("click", spin);
svg.append("g").attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")").append("path").attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z").style({
    "fill": "black"
});
container.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 60).style({
    "fill": "white",
    "cursor": "pointer"
});
container.append("text").attr("x", 0).attr("y", 15).attr("text-anchor", "middle").text("QUAY").style({
    "font-weight": "bold",
    "font-size": "30px",
    "cursor": "pointer"
});

function spin(d) {
    container.on("click", null);
    var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);
    rotation = (Math.round(rng / ps) * ps);
    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    rotation += 90 - Math.round(ps / 2);
    vis.transition().duration(3000).attrTween("transform", rotTween).each("end", function () {
        data[picked].action();
        oldrotation = rotation;
        container.on("click", spin);
    });
}

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return (t) => "rotate(" + i(t) + ")";
}

function getRandomNumbers() {
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

    if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function")
        window.crypto.getRandomValues(array);
    else
        for (var i = 0; i < 1000; i++)
            array[i] = Math.floor(Math.random() * 100000) + 1;
    return array;
}
