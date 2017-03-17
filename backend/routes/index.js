var express = require('express');
var router = express.Router();
require("../public/javascripts/db.js");
var person = require('../public/javascripts/person.js');
var trajectory = require('../public/javascripts/trajectory.js');
var stay = require('../public/javascripts/stay.js');
var mysql = require("mysql");
var rf = require('fs')
var conn = mysql.createConnection({
  host: '10.76.6.118',
  // host: '127.0.0.1',
  user: 'zhuminfeng',
  password: '123456789',
  // password:'wxs123456789',
  database: 'mobiledata',
  port: 3306
});
// conn.connect();

var conn1 = mysql.createConnection({
    host: '10.76.0.191',//liuliangjun's MySQL
    user: 'root',
    password: '',
    database: 'mobiledata',
    port: 3306
});
// conn1.connect();



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/beauty',function(req, res){
    x=req.param('a');
    var data=rf.readFileSync("./data/data.json","utf-8");  
    res.json(data)
})

router.get('/getSites', function (req, res) {
    var x1 = req.param("x1");
    var x2 = req.param("x2");
    var y1 = req.param("y1");
    var y2 = req.param("y2");
    var sql = "SELECT id,longitude,latitude FROM site_new WHERE longitude>" + x1 + "and longitude< " + x2 + "and latitude >" + y1 + "and latitude<" + y2;
    conn.query(sql, function (err, data, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    });
});


router.get('/getTrajByIndex', function (req, res) {

    //var index = req.param("userIndexList");
    var index = req.query.userIndexList;
    console.log(index)

    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.json(index)
    //trajectory.aa()
    //trajectory.searchTrajByIndex(index)
    trajectory.searchTrajByIndex(index, function (trajectorylist) {
        //res.json(index)
        res.json(trajectorylist);
    })

});
router.get('/getTrajByID', function (req, res) {
    var userId =req.param("userID");
    var sql= "SELECT time,siteid FROM trajectory WHERE userid=" + userId+" order by time asc";
    res.setHeader('Access-Control-Allow-Origin', '*');
    conn1.query(sql, function (err,data,fields) {
        res.json(data);
    })

});
router.get('/getTrajByPersons', function (req, res) {
    var persons =req.param("persons");
    var sql= "SELECT userid, time,siteid FROM trajectory WHERE userid in (" + persons+" ) order by userid asc,time asc";
    res.setHeader('Access-Control-Allow-Origin', '*');
    conn1.query(sql, function (err,data,fields) {
        res.json(data);
    })

});

router.get('/getFlowsByID', function (req, res) {
    var siteid = req.param("siteID");
    var sql = "SELECT duration,incount,outcount FROM siteflow WHERE siteid=" + siteid;
    res.setHeader('Access-Control-Allow-Origin', '*');
    conn1.query(sql, function (err, data, fields) {
        res.json(data);
    });
});

router.get('/getSiteFlowRecord', function (req, res) {
    var duration = req.param("duration");
    var siteId = req.param("siteId");
    var sql = "SELECT site_id1,site_id2,v1,v2 FROM (SELECT * FROM flow WHERE duration=" + duration +
        ") as temp WHERE site_id1=" + siteId + " or site_id2=" + siteId;
    console.log(sql);
    res.setHeader('Access-Control-Allow-Origin', '*');
    conn1.query(sql, function (err, data, fields) {
        res.json(data);
    });
});
router.get('/getPersonsBySite',function (req,res) {
    var duration=req.param("duration");
    var siteId=req.param("siteId");
    var sql="SELECT persons FROM personlist WHERE siteid=" + siteId+" and duration="+duration;
    res.setHeader('Access-Control-Allow-Origin', '*');
    conn1.query(sql,function (err,data,fields) {
        res.json(data);
    });
});

/////////////////////////////////////////////////////////////////////////////old below

router.get('/search', function (req, res) {
    console.log("Enter router.post'/search'");
    var name = req.param("name");
    // person.personlist(name,function(err, personlist){
    //   //  console.log(personlist);
    //   res.json(personlist);
    // });
    trajectory.searchByID(name, function (err, trajectorylist) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(trajectorylist);
    });
});

router.get('/search3', function (req, res) {
    var type = req.param("type");
    stay.getData(type, function (err, data) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    });
});

router.get('/getTrajectoryByNode', function (req, res) {
    var type = req.param("type");
    var time = req.param("time");
    var sql = "SELECT * FROM clustertrajectory WHERE timeid=" + time + " AND clusterid=" + type + ' limit 0,100';
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getTrajectoryByNodeFor168', function (req, res) {
    var type = req.param("type");
    var time = req.param("time");
    var sql = "SELECT * FROM clustertrajectoryfor168 WHERE timeid=" + time + " AND clusterid=" + type + ' limit 0,100';
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getTrajectoryByType', function (req, res) {
    var type = req.param("type");
    var sql = "SELECT * FROM clustertrajwithouttime WHERE clusterid=" + type + ' limit 0,100';
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getClusterRange', function (req, res) {
    var sql = "SELECT * FROM clusterrange";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/statistics', function (req, res) {
    var type = req.param("type");
    var time = req.param("time");
    var sql = "SELECT * FROM clusterstatistics WHERE timeindex=" + time + " AND clusterindex=" + type;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/statisticsFor168', function (req, res) {
    var type = req.param("type");
    var time = req.param("time");
    var sql = "SELECT * FROM clusterstatisticsfor168 WHERE timeindex=" + time + " AND clusterindex=" + type;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/statisticsWithoutTime', function (req, res) {
    console.log('asdf');
    var type = req.param("type");
    var sql = "SELECT * FROM clusterstatisticswithoutt WHERE clusterid=" + type;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/statisticsTotal', function (req, res) {
    var sql = "SELECT * FROM clustertotal";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getClusterAvg', function (req, res) {
    var sql = "SELECT * FROM clusteravg";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getNodes', function (req, res) {
    var sql = "SELECT * FROM statecount";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getNodesFor168', function (req, res) {
    var sql = "SELECT * FROM statecountfor168";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getClusterPeople', function (req, res) {
    var sql = "SELECT * FROM nodesize";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPeopleFeature', function (req, res) {
    var userid = req.param("id");
    var sql = "SELECT * FROM usercountdata WHERE userid=" + userid;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPeopleFeatureFor168', function (req, res) {
    var userid = req.param("id");
    var sql = "SELECT * FROM usercountdatafor168 WHERE userid=" + userid;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPersonPath', function (req, res) {
    var id = req.param("id");
    var sql = "SELECT * FROM usercountdata where userid=" + id;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPersonPathFor168', function (req, res) {
    var id = req.param("id");
    var sql = "SELECT * FROM usercountdatafor168 where userid=" + id;
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPersonTrac', function (req, res) {
    var id = req.param("id");
    trajectory.searchByID(id, function (trajectorylist) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(trajectorylist);
    })
});

router.get('/test', function (req, res, next) {
    res.json("{}");
});

router.get('/getPeopleHome', function (req, res) {
    var longitude1 = req.param("longitude1");
    var longitude2 = req.param("longitude2");
    var latitude1 = req.param("latitude1");
    var latitude2 = req.param("latitude2");
    var sql = "SELECT userid,homelocx,homelocy FROM usercountdata where homelocx >= " + longitude1 + " and homelocx <=" + longitude2 +
        " and homelocy >= " + latitude1 + " and homelocy <=" + latitude2 + ' limit 0,100';
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });

});

router.get('/getPeopleHomeFor168', function (req, res) {
    var longitude1 = req.param("longitude1");
    var longitude2 = req.param("longitude2");
    var latitude1 = req.param("latitude1");
    var latitude2 = req.param("latitude2");
    var sql = "SELECT userid,homelocx,homelocy FROM usercountdatafor168 where homelocx >= " + longitude1 + " and homelocx <=" + longitude2 +
        " and homelocy >= " + latitude1 + " and homelocy <=" + latitude2 + ' limit 0,100';
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });

});

router.get('/getPeopleclu', function (req, res) {
    var nodelist = Array();
    var sqlpart = "";
    var nodelistarray = req.param("nodelist");
    nodelist = nodelistarray.split('-');

    sqlpart = "time" + nodelist[0].split(",")[0] + "=" + nodelist[0].split(",")[1];
    for (var i = 1; i < nodelist.length; i++) {
        sqlpart = sqlpart + " and time" + nodelist[i].split(",")[0] + "=" + nodelist[i].split(",")[1];
    }
    var sql = "SELECT userid,homelocx,homelocy FROM usercountdata where " + sqlpart;
    //console.log(sql);
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPeoplecluFor168', function (req, res) {
    var nodelist = Array();
    var sqlpart = "";
    var nodelistarray = req.param("nodelist");
    nodelist = nodelistarray.split('-');

    sqlpart = "time" + nodelist[0].split(",")[0] + "=" + nodelist[0].split(",")[1];
    for (var i = 1; i < nodelist.length; i++) {
        sqlpart = sqlpart + " and time" + nodelist[i].split(",")[0] + "=" + nodelist[i].split(",")[1];
    }
    var sql = "SELECT userid,homelocx,homelocy FROM usercountdatafor168 where " + sqlpart;
    //console.log(sql);
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});


router.get('/getPeopleByIDs', function (req, res) {
    var userArray = new Array();
    var useridlist = req.param("useridlist");
    userArray = useridlist.split('-');
    var sqlpart = userArray[0];
    for (var i = 1; i < userArray.length; i++) {
        sqlpart = sqlpart + ',' + userArray[i];
    }
    var sql = "SELECT * FROM usercountdata where userid in (" + sqlpart + ")";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getPeopleByIDsFor168', function (req, res) {
    var userArray = new Array();
    var useridlist = req.param("useridlist");
    userArray = useridlist.split('-');
    var sqlpart = userArray[0];
    for (var i = 1; i < userArray.length; i++) {
        sqlpart = sqlpart + ',' + userArray[i];
    }
    var sql = "SELECT * FROM usercountdatafor168 where userid in (" + sqlpart + ")";
    conn.query(sql, function (err, nodes, fields) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(nodes);
    });
});

router.get('/getTrajByIDs', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var ids = req.param("useridlist");
    if (!ids) {
        ids = "460028254340071,460023748852971,460008763548271";
    }
    trajectory.searchTrajByIDs(ids, function (trajectorylist) {
        res.json(trajectorylist);
    })
});

router.get('/getFeatureByIdTime', function (req, res) {
    var id = Number(req.param("id"));
    var stime = Number(req.param("stime"));
    var etime = Number(req.param("etime"));
    // if(!id){
    //       id=460005876051371;
    //       stime=1390236778723;
    //       etime=1390468428191;
    // }
    trajectory.searchFeatureByID(id, stime, etime, function (trajectorylist) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(trajectorylist);
    })
});


module.exports = router;
