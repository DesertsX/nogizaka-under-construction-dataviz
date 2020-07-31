async function drawChart(elid, xAccessor, yAccessor, yLabel) {
  const data = await d3.json("./nogizaka_under_construction_ep01_268.json");
  console.log(data.length);
  const width = d3.max([window.innerWidth * 0.9, 1000]);
  console.log(width);
  const height = 700;
  const margin = 70;

  const innerWidth = width - margin * 2;
  const innerHeight = height - margin * 2;

  const svg = d3
    .select(elid)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  const xDomain = d3.extent(data, xAccessor);
  const yDomain = d3.extent(data, yAccessor);
  console.log(xDomain, yDomain);
  const xScale = d3.scaleLinear().domain(xDomain).range([0, innerWidth]).nice();

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0])
    .nice();

  const xAxisGene = d3.axisBottom().scale(xScale);
  const yAxisGene = d3.axisLeft().scale(yScale);
  svg
    .append("g")
    .call(xAxisGene)
    .attr("class", "axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .attr("stroke-width", 1.5);

  svg
    .append("g")
    .call(yAxisGene)
    .attr("class", "axis")
    .attr("stroke-width", 1.5);

  const lineGene = d3
    .line()
    .curve(d3.curveCatmullRom.alpha(0.5))
    // .x((d) => xScale(d.ep))
    .x((d) => xScale(xAccessor(d)))
    // .y((d) => yScale(d.play))
    .y((d) => yScale(yAccessor(d)));

  svg
    .append("path")
    .attr("d", lineGene(data))
    .attr("fill", "none")
    // .attr("stroke", "purple")
    .attr("stroke", "#8e44ad")
    // .style("stroke-opacity", 0.8)
    .attr("stroke-width", 2);

  const mouseEnter = function (_, i) {
    const text = circleGroup
      .append("text")
      .attr("class", "selected")
      .attr("x", (d) => xScale(xAccessor(d)))
      .attr("y", (d) => yScale(yAccessor(d)) - 30)
      .attr("text-anchor", "middle");

    text
      .append("tspan")
      .text((d, idx) => (idx === i ? `${yLabel}:${yAccessor(d)}` : ""));

    text
      .append("tspan")
      .attr("x", (d) => xScale(xAccessor(d)))
      .attr("y", (d) => yScale(yAccessor(d)) - 10)
      .text((d, idx) =>
        idx === i ? `${d.title.replace(/【.*?】/g, "")}` : ""
      );
  };

  const mouseLeave = function () {
    circleGroup.selectAll(".selected").remove();
  };

  // Add the point text
  const circleGroup = svg
    // .selectAll("g")
    // 一开始写成 上面的，倒是前40ep左右没有point，挺细碎的错误的
    .selectAll(".circle-group")
    .data(data)
    .enter()
    .append("g");
  // svg
  //   .selectAll("point")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  circleGroup
    .append("circle")
    .attr("fill", "#e74c3c")
    .attr("stroke", "none")
    .attr("opacity", 0.8)
    // .attr("cx", (d) => xScale(d.ep))
    // .attr("cy", (d) => yScale(d.play))
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 5)
    .on("mouseenter", mouseEnter)
    .on("mouseleave", mouseLeave);

  // title
  svg
    .append("text")
    // .text("「乃木坂工事中」各期熟肉播放量(EP01-268)")
    .text(`「乃木坂工事中」各期熟肉${yLabel}(EP01-268)`)
    .attr("x", innerWidth / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .attr("font-size", 20)
    .attr("font-weight", "bold");

  // author
  svg
    .append("text")
    .text("by 古柳 | weibo: 牛衣古柳DX")
    .attr("x", innerWidth / 2 + 100)
    .attr("y", -25)
    .attr("text-anchor", "middle")
    .attr("font-size", 15);

  let annotations;
  if (elid === "#chart1") {
    annotations = [
      {
        note: {
          title: "EP64播放量最高(379644次)",
          label: "赤脚来进行○○大会，污力十足的游戏对决",
          bgPadding: 10,
        },
        //can use x, y directly instead of data
        // data: { ep: 64, play: d3.max(data, (d) => d.play) },
        color: ["#e67e22"],
        x: xScale(64),
        y: yScale(d3.max(data, yAccessor)),
        className: "show-bg",
        dx: 50,
        dy: 37,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP42播放量次高(211644次)",
          label: "二期生送一期生礼物大作战 情人节企划前篇",
          bgPadding: 10,
        },
        color: ["#f39c12"],
        x: xScale(42),
        y: yScale(211644),
        className: "show-bg",
        dx: 110,
        dy: -1,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP13播放量最低(24206次)",
          label: "生驹里奈前往神秘的地底湖 12单祈愿番外篇",
          bgPadding: 10,
        },
        color: ["#27ae60"],
        x: xScale(13),
        y: yScale(d3.min(data, yAccessor)),
        className: "show-bg",
        dx: 2,
        dy: -270,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP185播放量次低(29826次)",
          label: "3期守护前辈作战企划 上篇",
          bgPadding: 10,
        },
        color: ["#2ecc71"],
        x: xScale(185),
        y: yScale(29826),
        className: "show-bg",
        dx: 2,
        dy: -170,
        connector: { end: "arrow" },
      },
    ];
  }
  if (elid === "#chart2") {
    annotations = [
      {
        note: {
          title: "EP136弹幕数最高(7668条)",
          label: "圣诞妄想1小时SP",
          bgPadding: 10,
        },
        color: ["#e67e22"],
        x: xScale(136),
        y: yScale(d3.max(data, yAccessor)),
        className: "show-bg",
        dx: 40,
        dy: 10,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP112弹幕数次高(5727条)",
          label: "18单选拔发表",
          bgPadding: 10,
        },
        color: ["#f39c12"],
        x: xScale(112),
        y: yScale(5727),
        className: "show-bg",
        dx: -30,
        dy: -100,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP83弹幕数第三高(5257条)",
          label: "乃木坂私服show2016冬 年上组篇",
          bgPadding: 10,
        },
        color: ["#fbb759"],
        x: xScale(83),
        y: yScale(5257),
        className: "show-bg",
        dx: -40,
        dy: -20,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP186弹幕数最低(427条)",
          label: "3期守护前辈作战企划 下篇",
          bgPadding: 10,
        },
        color: ["#27ae60"],
        x: xScale(186),
        y: yScale(d3.min(data, yAccessor)),
        className: "show-bg",
        dx: 20,
        dy: -270,
        connector: { end: "arrow" },
      },
      {
        note: {
          title: "EP183弹幕数次低(508条)",
          label: "绝叫部活动 上篇",
          bgPadding: 10,
        },
        color: ["#2ecc71"],
        x: xScale(183),
        y: yScale(508),
        className: "show-bg",
        dx: -5,
        dy: -340,
        connector: { end: "arrow" },
      },
    ];
  }
  const makeAnnotations = d3
    .annotation()
    .editMode(true)
    .notePadding(15)
    // .type(d3.annotationCallout)
    .annotations(annotations);
  svg.append("g").attr("class", "annotation-group").call(makeAnnotations);

  // Mean Line
  const mean = d3.mean(data, yAccessor);
  const meanLine = svg
    .append("line")
    .attr("y1", yScale(mean))
    .attr("y2", yScale(mean))
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("stroke", "#2980b9")
    .attr("stroke-dasharray", "4px 4px");
  let meanXY = [];
  if (elid === "#chart1") {
    meanXY = [innerWidth - 40, yScale(mean) - 15];
  }
  if (elid === "#chart2") {
    meanXY = [innerWidth - 40, yScale(mean) - 35];
  }
  const meanLabel = svg
    .append("text")
    .attr("y", meanXY[1])
    .attr("x", meanXY[0])
    .text(`平均${yLabel}：${parseInt(mean)}`)
    .attr("fill", "#2980b9")
    .style("font-size", "12px")
    .style("text-anchor", "middle");
  // init() {
  //   setSize();
  //   setScales();
  //   renderYGrid();
  //   renderAxes();
  //   renderLine();
  //   // initToolTip();
  //   // renderArea();
  // },
}

drawChart(
  "#chart1",
  (d) => +d.ep,
  (d) => +d.play,
  "播放量"
);

drawChart(
  "#chart2",
  (d) => +d.ep,
  (d) => +d.video_review,
  "弹幕数"
);
