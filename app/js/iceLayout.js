import $ from 'jquery'
import * as d3 from 'd3'

let iceData = {}
// 整个svg的
const margin = {top: 10, bottom: 10, left: 20, right: 20}
const padding = {top: 10, bottom: 10, left: 20, right: 20}
const rectPadding = 2
const rectPaddingSmall = 0

const processIce = data => {
    let obj = {}// ，时间对应的树结构
    console.log('start')
    const deal = (objQuote, name, dataQuote) => {
        objQuote.name = name
        if (typeof dataQuote === 'number') {
            objQuote.size = dataQuote
        } else {
            if (!objQuote.hasOwnProperty('children')) {
                objQuote.children = []
            }
            Object.keys(dataQuote).forEach(key => {
                deal(objQuote.children[objQuote.children.length] = {}, key, dataQuote[key])
            })
        }
    }
    Object.keys(data).forEach(key => {
        obj[key] = {}
        deal(obj[key], Object.keys(data[key])[0], Object.values(data[key])[0])// 存的地方，key values
    })
    return obj
}

const layoutIce = (data, svg, rectPadding) => {
    let height = parseInt($(svg.node()).height()) - margin.top - margin.bottom - padding.top - padding.bottom
    let width = (parseInt($(svg.node()).width()) - margin.left - margin.right) / Object.keys(data).length - padding.left - padding.right
    let partition = d3.partition()
        .size([height, width])
        .padding(rectPadding)
    let obj = {}
    console.log(iceData.layoutData)
    Object.keys(data).forEach(time => {
        let dataT = d3.hierarchy(data[time]).sum(d => d.children ? 0 : 1)
        obj[time] = partition(dataT)
    })
    let time = Object.keys(obj)
    let timeArr = time.map(d => obj[d]) // 每个时间的数据
    let line = {}
    let per = obj[time[0]].descendants()// 前一年数据
    let perYear = time[0]// 前一年
    time.forEach((d, i) => {
        let nodes = obj[time[i]].descendants() // 当年数据
        if (i) {
            nodes.forEach((data, i) => {
                per.forEach(dataPer => {
                    if (dataPer.data.name === data.data.name && dataPer.depth === data.depth) {
                        if (!line.hasOwnProperty(perYear)) {
                            line[perYear] = []
                        }
                        let o = {
                            name: data.data.name,
                            depth: dataPer.depth,
                            // x0: dataPer.x1,
                            // y0: dataPer.y1 - (dataPer.y1 - dataPer.y0) / 2,
                            // x1: data.x0,
                            // y1: data.y0 - (data.y1 - data.y0) / 2

                            x0: dataPer.x1 - (dataPer.x1 - dataPer.x0) / 2,
                            y0: dataPer.y1,
                            x1: data.x1 - (data.x1 - data.x0) / 2,
                            y1: data.y0
                        }
                        line[perYear].push(o)
                    }
                })
            })
        }
        per = nodes
        perYear = time[i]
    })
    return {data: obj, time: time, timeArr: timeArr, line: line}
}

const renderIce = (layoutData, svg) => {
    let data = layoutData.data
    let time = layoutData.time
    let timeArr = layoutData.timeArr
    // let line = layoutData.line
    let width = (parseInt($(svg.node()).width()) - margin.left - margin.right) / Object.keys(data).length
    let id = svg.attr('id')
    let ice = svg.append('g').attr('id', `${id}iceDom`)
    let iceTimeG = ice.selectAll('.iceTimeg')
        .data(timeArr, (d, i) => time[i])
    let iceTimeDom = iceTimeG.enter()
        .append('g')
        .attr('class', 'iceTimeg')
        .attr('year', (d, i) => time[i])
        .attr('transform', (d, i) => `translate(${i * width},0)`)
    iceTimeG.exit().remove()
  
    iceTimeDom.each(function (d) {
        let g = d3.select(this)
        let data = d.descendants()
        let iceG = g.selectAll('.iceeach')
            .data(data, d => d.data.name)
        let iceDom = iceG.enter()
            .append('rect')
            .attr('class', 'iceeach')
            .attr('x', d => d.y0)
            .attr('y', d => d.x0)
            .attr('width', d => d.y1 - d.y0)
            .attr('height', d => d.x1 - d.x0)
            .attr('fill', '#ddd')
            .attr('iceName', d => d.data.name)
            .attr('depth', d => d.depth)

        iceDom.exit().remove()
    })
}
const renderLine = (line, svg) => {
    let width = (parseInt($(svg.node()).width()) - margin.left - margin.right) / (Object.keys(line).length + 1)
    let svgLineG = svg.append('g').attr('id', 'svgLine')
    svg.selectAll('.iceTimeg').each(function (x, i) {//第几个year的line G
        let svgg = svgLineG.append('g')
            .attr('transform', `translate(${i * width},0)`)
        let g = d3.select(this)
        let year = g.attr('year')
        if (line.hasOwnProperty(year)) {
            let lineData = line[year]
            let iceLineG = svgg.selectAll('.iceline')
                .data(lineData)
            let iceLineDom = iceLineG.enter()
                .append('path')
                .attr('class', 'iceline')
                .attr('d', d => {
                    let x0 = d.y0
                    let y0 = d.x0
                    let x1 = d.y1 + width
                    let y1 = d.x1
                    let z = (x1 - x0) / 2
                    let s = `M${x0},${y0} C ${x0 + z},${y0} ${x1 - z},${y1} ${x1},${y1}`
                    return s
                })
                .attr('iceName', d => d.name)
                .attr('depth', d => d.depth)
                .style('fill', 'none')
                .style('stroke', 'red')
                .style('display', 'none')
            iceLineDom.exit().remove()
        }
    })
}

const addEventIce = () => {
    // hover rect的联动效果
    d3.selectAll('.iceeach').on('mouseover', () => {
        let target = d3.select(d3.event.target)
        let iceName = target.attr('iceName')
        // let depth = target.attr('depth')
        d3.selectAll(`[iceName="${iceName}"]`).attr('fill', 'grey')
        d3.selectAll(`.iceline[iceName="${iceName}"]`).style('display', 'inline')
    })
    .on('mouseout', () => {
        d3.selectAll('.icieline').remove()
        d3.selectAll(`[iceName]`).attr('fill', '#ddd')
        d3.selectAll(`.iceline[iceName][depth]`).style('display', 'none')
    })
}
export const iceInit = (data, svg, svgSmall) => {
    iceData.orignData = data
    iceData.dealData = processIce(iceData.orignData)
    iceData.layoutData = layoutIce(iceData.dealData, svg, rectPadding)
    iceData.layoutDataSmall = layoutIce(iceData.dealData, svgSmall, rectPaddingSmall)
    renderIce(iceData.layoutData, svg)
    renderIce(iceData.layoutDataSmall, svgSmall)
    renderLine(iceData.layoutData.line, svg)
    renderLine(iceData.layoutDataSmall.line, svgSmall)

    addEventIce()
    return iceData
}
