/**
 * Created by vag on 2016/12/27.
 */

import $ from "jquery";
import * as d3 from 'd3'
import 'semantic/dist/semantic.min.js'
$(document).ready(function() {
    //菜单效果
    $(".launch.button").mouseenter(function(){
            $(this).stop().animate({width: '150px'}, 300,
                 function(){$(this).find('.text').show();});
        }).mouseleave(function (event){
            $(this).find('.text').hide();
            $(this).stop().animate({width: '70px'}, 300);
        }).on('click',()=>$('.ui.left.sidebar.menu').sidebar('toggle'))


});
