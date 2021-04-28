var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
    database : 'Neighborhood',
    port:'3306'
});

let neighbordb = {};

neighbordb.register = (username, password, email) => {
   
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('INSERT into USERS(uid,pwd,email) VALUES(?, ?, ?)', [username, password, email], (err,results) => {
            if (err){
                ///console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);

        });

    });

};
neighbordb.login = (username) => {
   
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid, pwd FROM USERS WHERE uid = ? ', [username], (err,results) => {
            if (err){
                ///console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.userprofile = (uid) => {
   console.log("username:!"+uid);
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT * FROM USER_PROFILE WHERE uid = ? ', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.updateProfile = (uid, address, city, state, introduction, family_info, photo_url) => {
   
    return new Promise((resolve, reject) => {
        console.log("xxx");
        connection.query('INSERT INTO USER_PROFILE (uid, address, city, state, introduction, family_info, photo_url) VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE uid =?, address = ?,city = ?, city = ?, introduction = ?, family_info = ?, photo_url = ?;'
        , [uid, address, city, state, introduction, family_info, photo_url,uid, address, city, state, introduction, family_info, photo_url], (err,results) => {
            if (err){
                ///console.log(err);
                return reject(err);
            }
            
            return resolve(results);

        });

    });

};

//friendlist
neighbordb.friendlist = (uid) => {
    
     return new Promise((resolve, reject) => {
         //console.log("xxx");
         connection.query('SELECT uid2 FROM FRIENDS WHERE uid1 = ? and fstatus = 3 UNION SELECT uid1 FROM FRIENDS WHERE uid2 = ? and fstatus = 3', [uid,uid], (err,results) => {
             if (err){
                 console.log(err);
                 return reject(err);
             }
             //console.log(results);
             return resolve(results);
         });
     });
 };
 neighbordb.friendstatus = (uid1,uid2) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid1,fstatus FROM FRIENDS WHERE (uid1 = ? AND uid2 = ?) OR (uid1 = ? AND uid2 = ?)', [uid1,uid2,uid2,uid1], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.friendrequest1 = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid2 FROM FRIENDS WHERE uid1 = ? AND fstatus = 2', [uid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.friendrequest2 = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid1 FROM FRIENDS WHERE uid2 = ? AND fstatus = 1', [uid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.friendrecommend = (bid,uid) => {

    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid FROM USERS WHERE bid = ? and uid != ?', [bid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.addfriend = (uid1,uid2) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('INSERT FRIENDS(uid1,uid2,fstatus) values(?, ?, 1)', [uid1,uid2], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.requestfriend = (uid1,uid2) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('UPDATE FRIENDS SET fstatus = ? WHERE (uid1 = ? and uid2 = ?) or (uid2 = ? and uid1 = ?);', [3,uid1,uid2,uid1,uid2], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.checkBid = (uid1,uid2) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('INSERT FRIENDS(uid1,uid2,fstatus) values(?, ?, 1)', [uid1,uid2], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.neighborList = (uid1) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid2 FROM NEIGHBORS WHERE uid1 = ?', [uid1], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.neighborStatus = (uid1,uid2) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT uid1 FROM NEIGHBORS WHERE uid1 = ? AND uid2 = ?', [uid1,uid2], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.addNeighbor = (uid1,uid2) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('INSERT NEIGHBORS(uid1,uid2) values(?, ?)', [uid1,uid2], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.joinBlock = (bid,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('INSERT NEIGHBOR_JOIN(bid,uid,nstatus,accept_number) values(?, ?, ?, ?)', [bid,uid,0,0], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.acceptJoinBlock = (bid,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('UPDATE NEIGHBOR_JOIN SET accept_number= accept_number + 1 WHERE bid = ? AND uid = ?', [bid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.showBid = () => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT bid FROM BLOCKS',  (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.showBlockname = () => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT block_name FROM BLOCKS',  (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.myBlock = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select bid from USERS where uid = ?', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.myBlockname = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select bid from USERS natural join Blocks where uid = ?', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.checkJoinBlock = (bid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select uid from NEIGHBOR_JOIN where bid = ? and nstatus = 0', [bid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.checkAcceptNumber = (bid,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT accept_number FROM NEIGHBOR_JOIN WHERE bid = ? and uid = ?', [bid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.countOfBlock = (bid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('SELECT count(uid) as count FROM USERS WHERE bid = ? ', [bid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.updatebid = (bid, uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('UPDATE USERS SET bid = ? WHERE  uid = ?', [bid, uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.leavebid = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('update users set bid = null where uid = ?', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.updatenstatus = (bid,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('UPDATE NEIGHBOR_JOIN SET nstatus = 1 WHERE  bid = ? and uid = ?', [bid, uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.leaveBlock = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('UPDATE USERS SET bid = NULL WHERE  uid = ?', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.gettid = (title) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select tid from thread where title = ? order by tid desc limit 1', [title], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.getmid = (title,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select mid from thread where title = ? and uid = ?', [title,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.insertInThread = (title,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('Insert into thread(title, author) values(?, ?)', [title,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.insertInThreadUser = (data) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('Insert into thread_users values ?', [data], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.insertInThreadmsg = (title, uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('insert into thread_msg select tid, mid from thread, message where title = ? and author_id = ? order by tid,mid desc limit 1', [title, uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.insertInMsg = (uid,posttime,textbody) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('Insert into message(author_id, posttime, textbody) values(?, ?, ?)', [uid,posttime,textbody], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.messagesCanSee = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select distinct tid, title, author from THREAD natural join THREAD_USERS natural join THREAD_MSG natural join MESSAGE where uid = ?', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.messagesUnread = (uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select distinct tid, title, author from THREAD natural join THREAD_USERS natural join message natural join thread_msg where uid = ? and (last_read_time is null or last_read_time < posttime)', [uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.updateUnread = (dt,tid,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('update thread_users natural join thread set last_read_time = ? where thread_users.tid = ? and thread_users.uid = ?', [dt,tid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.messagesdetail = (tid,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select * from THREAD_USERS natural join thread natural join thread_msg natural join message where tid = ? and uid=?', [tid,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};

neighbordb.usersAdress = (bid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select address from USER_PROFILE natural join USERS where bid = ?', [bid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.Blockname = (bid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select hood_name, block_name from HOODS natural join BLOCKS where bid = ?', [bid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
neighbordb.searchtextbody = (textbody,uid) => {
    
    return new Promise((resolve, reject) => {
        //console.log("xxx");
        connection.query('select DISTINCT THREAD.tid as tid,title, author from THREAD natural join message natural join thread_msg join THREAD_USERS where textbody like ? and uid = ?', [textbody,uid], (err,results) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            //console.log(results);
            return resolve(results);
        });
    });
};
module.exports = neighbordb;
