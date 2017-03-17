import $ from 'jquery'
import * as d3 from 'd3'

let iceData = {}
// 整个svg的
const margin = {top: 10, bottom: 10, left: 20, right: 20}
const padding = {top: 10, bottom: 10, left: 20, right: 20}

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
    iceData.dealData = obj
}

const layoutIce = (data, svg) => {
    const rectPadding = 2
    let height = parseInt($(svg.node()).height()) - margin.top - margin.bottom - padding.top - padding.bottom
    let width = (parseInt($(svg.node()).width()) - margin.left - margin.right) / Object.keys(data).length - padding.left - padding.right
    let partition = d3.partition()
        .size([height, width])
        .padding(rectPadding)
    let obj = {}
    Object.keys(data).forEach(time => {
        let dataT = d3.hierarchy(data[time]).sum(d => d.children ? 0 : 1)
        obj[time] = partition(dataT)
    })
    let time = Object.keys(obj)
    let timeArr = time.map(d => obj[d]) // 每个时间的数据
    // time.forEach(d => {
        
    // })

    iceData.layoutData = obj
    iceData.time = time
    iceData.timeArr = timeArr
}

const renderIce = (data, time, timeArr, svg) => {
    let width = (parseInt($(svg.node()).width()) - margin.left - margin.right) / Object.keys(data).length
    let ice = svg.append('g').attr('id', 'iceDom')
    let iceTimeG = ice.selectAll('.iceTimeg')
        .data(timeArr, (d, i) => time[i])
    let iceTimeDom = iceTimeG.enter()
        .append('g')
        .attr('class', 'iceTimeg')
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
            .attr('fill', 'red')
            .attr('iceName', d => d.data.name)
        iceDom.exit().remove()
    })
}

const addEventIce = () => {
    // hover rect的联动效果
    d3.selectAll('.iceeach').on('mouseover', () => {
        let target = d3.select(d3.event.target)
        let iceName = target.attr('iceName')
        d3.selectAll(`[iceName="${iceName}"]`).attr('fill', 'blue')
    })
    .on('mouseout', () => {
        d3.selectAll(`[iceName]`).attr('fill', 'red')
    })
}
export const iceInit = (data, svg) => {
    iceData.orignData = data
    processIce(iceData.orignData)
    layoutIce(iceData.dealData, svg)
    renderIce(iceData.layoutData, iceData.time, iceData.timeArr, svg)
    addEventIce()
}
