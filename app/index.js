/**
 * Created by vag on 2016/12/27.
 */

import $ from 'jquery'
import * as d3 from 'd3'
import {iceInit} from './iceLayout.js'
import 'semantic-ui/dist/semantic.min.js'
$(document).ready(function () {
    // 菜单效果
    $('.launch.button').mouseenter(function () {
        $(this).stop().animate({width: '150px'}, 300,
    function () { $(this).find('.text').show() })
    }).mouseleave(function () {
        $(this).find('.text').hide()
        $(this).stop().animate({width: '70px'}, 300)
    }).on('click', () => $('.ui.left.sidebar.menu').sidebar('toggle'))
    // getData 3个数据
    let svg = d3.select('#inice')
    $.get('http://localhost:3001/beauty', {'a': 123}, data => iceInit(JSON.parse(data), svg))
})
