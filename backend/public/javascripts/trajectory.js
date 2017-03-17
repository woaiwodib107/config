/**
 * Created by huwanqi on 2016/3/11.
 */
var mongoose = require('mongoose');

// var coordinate = new mongoose.Schema({
//   coordinate:[Number]
// });
//var schema = new mongoose.Schema({
//    userid:Number
//});
//var trajectory = mongoose.model('trajectory', schema,"trajectory");


//Mongoose added the ability to specify the collection name under the schema, or as the third argument when declaring the model.
// Otherwise it will use the pluralized version given by the name you map to the model.
var schema = mongoose.Schema(
    {
        userid:Number,
        index:Number,
        coordinates:Array,
    },
    {
        collection: 'Trajectory'
    }
);


function merge(a, b) {
    if (b.length > a.length) {
        var t = a
        a = b
        b = t
    }

    return a.map(function(v, i) {
        return v + (b[i] || 0)
    })
}


var trajectory = mongoose.model("Trajectory", schema);
// trajectory.findOne(function(err,trajectorylist){
//     console.log(trajectorylist)
// });


exports.searchTrajByIndex = function(userindex,callback){
    index = userindex.map(function(data){
        return +data;
    });
    trajectory.find({index:{"$in":index}},{_id:0,userid:1,index:1,coordinates:1},function(err,trajectorylist){
        //console.log(trajectorylist)
        if(err){
            return console.log(err);
        }
        else{
            callback(trajectorylist);
        }
    });
};

exports.searchTrajByID = function(id,callback){
    // index = userindex.map(function(data){
    //     return +data;
    // });
    console.log(id)

    trajectory.find({userid:parseInt(id)},{_id:0,userid:1,index:1,coordinates:1},function(err,trajectorylist){
        //console.log(trajectorylist)
        if(err){
            return console.log(err);
        }
        else{
            callback(trajectorylist);
        }
    });
};















exports.searchFeatureByID=function(id,stime,etime,callback){
    console.log(id+"\t"+stime+"\t"+etime);
    trajectory.find({userid:id,starttime:{$gte:stime},endtime:{$lte:etime}},{_id:0,userid:1,featurevector:1},function(err,trajectorylist){
        var result=Array();
        if(!trajectorylist.length){
            callback(result);
            return false;
        }
        for(i in trajectorylist){
            result=merge(trajectorylist[i].featurevector,result);
        }
        for(i in result){
            result[i]=result[i]/trajectorylist.length;
        }
        callback(result);
    });
}
exports.aa=function(){
    console.log("aa");
}
exports.searchTrajByIDs = function(userids,callback){
    trajectory.find({userid:{"$in":userids.split(',')}},{_id:0,userid:1,records:1},function(err,trajectorylist){
        if(err){
            return console.log(err);
        }
        else{
            var records=Array();
            var userid=0;
            var result=Array();
            var tmpjson;
            for (i in trajectorylist){
                if(userid==0){
                    userid=trajectorylist[i].userid;
                    records.push(trajectorylist[i].records);
                }else if(userid==trajectorylist[i].userid){
                     records.push(trajectorylist[i].records);
                 }else{
                    //tmpjson={userid,records};
                    tmpjson={
                        userid: userid,
                        records: records
                    };
                    //tmpjson[userid] = records;
                    result.push(tmpjson);
                    records=[];
                    userid=trajectorylist[i].userid;
                 }
            }
            tmpjson={
                userid: userid,
                records: records
            };
            //tmpjson={userid,records};
            //tmpjson[userid] = records;
            result.push(tmpjson);
            callback(result);
        }
    });

};





// exports.searchByPos = function(longtitude1,latitude1,longtitude2,latitude2,callback){
//     if(!longtitude1||!latitude1||!longtitude2||!latitude2){
//         longtitude1=120.56999969482421875;
//         longtitude2=120.72613525390625;
//         latitude1=27.993799209594726562;
//         latitude2=27.995679855346679688;
//     }
//     trajectory.find({HomeLocX:{"$gte":longtitude1},HomeLocX:{"$lte":longtitude2},HomeLocY:{"$gte":latitude1},HomeLocY:{"$lte":latitude2}},{_id: 0,userid: 1},function(err,trajectorylist){
//         if(err) {
//             return console.error(err);}
//         else{
//             var userarray=new Array();
//             for (i in trajectorylist){
//                 var tmp=eval(trajectorylist[i]);
//                 if(userarray.length==0)
//                     userarray.push(trajectorylist[i]);
//                 else{
//                     if(tmp["userid"]!=userarray[userarray.length-1]["userid"]){
//                         userarray.push(trajectorylist[i]);
//                     }
//                 }
//             }
//             callback(userarray);
//         }
//     });
// };
exports.searchByID = function(userID, callback){
    console.log(userID=="");
    console.log(userID==undefined);
    if(!userID)
    {
        var random = Math.floor(Math.random()*1000);
        trajectory.find({index:random},function(err,trajectorylist){
            if (err) {return console.error(err);}
            else{
                console.log(trajectorylist);
                callback(trajectorylist);
            }
        });
    }
    else{
        trajectory.find({userid:userID},function(err,trajectorylist){
            if (err) {return console.error(err);}
            else{
                callback(trajectorylist);
            }
        });
    }
};
