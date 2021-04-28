const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const passport = require('passport');



router.get('/register', (req, res) => {
    res.render('register')
});
router.get('/login', (req, res) => {
    res.render('login')
});
router.get('/dashboard', async (req, res) => {
    console.log(req.user);
    let mybid = await db.myBlock(req.user[0].uid);
    console.log("mybid:::")
    console.log(mybid);
    let results = await db.userprofile(req.user[0].uid);
    let friend = await db.friendlist(req.user[0].uid);
    let neighbor = await db.neighborList(req.user[0].uid);
    let bids = await db.showBid();
    let blockname = await db.showBlockname();
    let applyJoinBlock = await db.checkJoinBlock(mybid[0].bid);
    let recommendlist = await db.friendrecommend(mybid[0].bid, req.user[0].uid);
    let friendrequestlist1 = await db.friendrequest1(req.user[0].uid);
    let friendrequestlist2 = await db.friendrequest2(req.user[0].uid);
    let myblock = await db.myBlock(req.user[0].uid);
    let topic = await db.messagesCanSee(req.user[0].uid);
    let unreadtopic = await db.messagesUnread(req.user[0].uid);
    let blockhood = await db.Blockname(myblock[0].bid);
    let usersAddress = await db.usersAdress(myblock[0].bid);

    console.log("usersadress");
    console.log(usersAddress);
    console.log("recommendlist");
    console.log(recommendlist);
    if (neighbor.length == 0) {
        console.log("check");
        neighbor = [{ uid2: 'go add some neighbors!' }];
    }
    if (friend.length == 0) {
        console.log("check");
        friend = [{ uid2: 'go add some friends!' }];
    }
    if(blockhood.length==0){
        blockhood = [{hood_name:"unknown",block_name:"unknown"}];
    }
    console.log(friend);
    console.log(results);
    console.log("blockhood");
    console.log(blockhood);
    if (results.length == 0) {
        res.render('dashboard', {
            user: req.user[0].uid,
            address: 'unknown',
            city: 'unknown',
            state: 'unknown',
            introduction: 'unknown',
            family_info: 'unknown',
            photo_url: 'unknown',
            friendlist: friend,
            neighbor: neighbor,
            bids: bids,
            blockname: blockname,
            applyJoinBlock: applyJoinBlock,
            mybid: mybid[0].bid,
            recommendlist: recommendlist,
            friendrequestlist1: friendrequestlist1,
            friendrequestlist2: friendrequestlist2,
            myblock: myblock[0].bid,
            topic: topic,
            unreadtopic: unreadtopic,
            usersAddress: usersAddress,
            hood: blockhood[0].hood_name,
            blockname1: blockhood[0].block_name
        })
    } else {
        res.render('dashboard', {
            user: req.user[0].uid,
            address: results[0].address,
            city: results[0].city,
            state: results[0].state,
            introduction: results[0].introduction,
            family_info: results[0].family_info,
            photo_url: results[0].photo_url,
            friendlist: friend,
            neighbor: neighbor,
            bids: bids,
            blockname: blockname,
            applyJoinBlock: applyJoinBlock,
            mybid: mybid[0].bid,
            recommendlist: recommendlist,
            friendrequestlist1: friendrequestlist1,
            friendrequestlist2: friendrequestlist2,
            myblock: myblock[0].bid,
            topic: topic,
            unreadtopic: unreadtopic,
            usersAddress: usersAddress,
            hood: blockhood[0].hood_name,
            blockname1: blockhood[0].block_name
        })
    }
});
router.get('/profile', async (req, res) => {
    let results = await db.userprofile(req.user[0].uid);
    if (results.length == 0) {
        res.render('profile', {
            user: req.user[0].uid,
            address: 'unknown',
            city: 'unknown',
            state: 'unknown',
            introduction: 'unknown',
            family_info: 'unknown',
            photo_url: 'unknown'
        })
    } else {
        res.render('profile', {
            user: req.user[0].uid,
            address: results[0].address,
            city: results[0].city,
            state: results[0].state,
            introduction: results[0].introduction,
            family_info: results[0].family_info,
            photo_url: results[0].photo_url
        })
    }
});
router.get('/suggestFriendList', async (req, res) => {
    console.log("username");
    console.log(req.query.name);
    console.log("friendname");
    console.log(req.user[0].uid);
});
router.post('/updateProfile', async (req, res) => {
    console.log(req.body)
    const { uid, address, city, state, introduction, family_info, photo_url } = req.body;
    console.log("uid" + uid);
    let errors = [];
    //let alertmessages =[];
    if (!uid || !address || !city || !state || !introduction || !family_info || !photo_url) {
        errors.push({ msg: 'Please fill in all fields pig!' });
    }
    if (errors.length > 0) {
        res.render('profile', {
            errors,
            user: uid,
            address,
            city,
            state,
            introduction,
            family_info,
            photo_url
        });
    } else {
        try {
            let results = await db.updateProfile(uid, address, city, state, introduction, family_info, photo_url);
            console.log(results);
            errors.push({ msg: 'update success!!!' });
            res.render('profile', {
                errors,
                user: uid,
                address,
                city,
                state,
                introduction,
                family_info,
                photo_url
            });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
});
//register hadle
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    let passwordcrypt = 0;
    //check
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields pig!' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //validate passed

        try {
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) throw err;
                    else {
                        let passwordcrypt = hash;
                        let results = await db.register(name, passwordcrypt, email);
                        res.redirect('login');
                    }

                }))
            console.log(passwordcrypt);
        } catch (e) {

            console.log(e);
            res.sendStatus(500);

        }
    }

})
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { console.log("1"); return next(err); }
        if (!user) {
            let errors = [];
            errors.push({ msg: ' invalid Password or username!' });
            if (errors.length > 0) {
                res.render('login', {
                    errors
                });
            }
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            console.log("user:", user);
            return res.redirect('/users/dashboard?uid=' + user[0].uid);
        });
    })(req, res, next);
});
router.get('/message', async (req, res) => {
    var dt = new Date();
    let result = await db.updateUnread(dt, req.query.tid, req.user[0].uid);
    console.log(result);
    let messageDetail = await db.messagesdetail(req.query.tid, req.user[0].uid);
    console.log(messageDetail);
    res.render('message', {
        messageDetail: messageDetail
    })
});
router.get('/friendpage', async (req, res) => {
    //console.log(req.query.name);
    //console.log(req.user[0].uid);
    let freindprofile = await db.userprofile(req.query.name);
    let friendstatus = await db.friendstatus(req.user[0].uid, req.query.name);
    let neighborStatus = await db.neighborStatus(req.user[0].uid, req.query.name);
    let fstatus = 0;
    let whosent = 0;
    if (friendstatus.length != 0 && friendstatus[0].uid1 == req.user[0].uid) {
        whosent = 1;
    } else {
        whosent = 2;
    }
    console.log("whosent" + whosent);

    if (friendstatus.length == 0) {
        fstatus = 0;
        friendstatus = [{ fstatus: 'add friend' }]
    } else if (friendstatus[0].fstatus == 1) {
        fstatus = 1;
        if (whosent == 2) {
            friendstatus = [{ fstatus: 'confirm request' }];
        }
        else if (whosent == 1) {
            friendstatus = [{ fstatus: 'sent request' }];
        }

    } else if (friendstatus[0].fstatus == 2) {
        fstatus = 2;
        if (whosent == 1) {
            friendstatus = [{ fstatus: 'confirm request' }];
        }
        else if (whosent == 2) {
            friendstatus = [{ fstatus: 'sent request' }];
        }

    } else if (friendstatus[0].fstatus == 3) {
        fstatus = 3;
        friendstatus = [{ fstatus: 'friend' }]
    }
    if (neighborStatus.length == 0) {
        neighborStatus = 'add neighbor'
    } else {
        neighborStatus = 'your neighbor'
    }
    //console.log(friendstatus);
    if (freindprofile.length == 0) {
        res.render('friend', {
            user: req.query.name,
            address: 'unknown',
            city: 'unknown',
            state: 'unknown',
            introduction: 'unknown',
            family_info: 'unknown',
            photo_url: 'unknown',

            friendstatus: friendstatus[0].fstatus,
            neighborStatus: neighborStatus
        })
    } else {
        res.render('friend', {
            user: req.query.name,
            address: freindprofile[0].address,
            city: freindprofile[0].city,
            state: freindprofile[0].state,
            introduction: freindprofile[0].introduction,
            family_info: freindprofile[0].family_info,
            photo_url: freindprofile[0].photo_url,

            friendstatus: friendstatus[0].fstatus,
            neighborStatus: neighborStatus
        })
    }
});
router.post('/addfriend', async (req, res) => {
    console.log(req.body.user);
    console.log(req.body);
    console.log(req.body.applier);
    console.log(req.user[0].uid);
    if (req.body.applier == "add friend") {
        console.log("add friend");
        let result = await db.addfriend(req.user[0].uid, req.body.user)
    } else {
        console.log("confirm");
        let result = await db.requestfriend(req.body.user, req.user[0].uid)
    }
    res.redirect('back');
});
router.post('/addneighbor', async (req, res) => {
    console.log(req.body.user);
    console.log("username!!!!");
    console.log(req.body.applier);
    console.log("friendname");
    console.log(req.user[0].uid);
    let result = await db.addNeighbor(req.user[0].uid, req.body.user);
    console.log(result);
    res.redirect('back');
});
router.post('/addbid', async (req, res) => {
    console.log(req.body.bid);
    console.log(req.user[0].uid);
    let results = await db.joinBlock(req.body.bid, req.user[0].uid);
    console.log(results);
    res.redirect('back');
});
router.post('/acceptbid', async (req, res) => {
    console.log(req.body);
    console.log(req.user[0].uid);
    console.log("3333");
    let mybid = await db.myBlock(req.user[0].uid);
    console.log(mybid);
    let result = await db.acceptJoinBlock(mybid[0].bid, req.body.applier);
    console.log(result);
    console.log("!!!!!!!!!!!");
    let accept_number = await db.checkAcceptNumber(mybid[0].bid, req.body.applier);
    console.log(accept_number)
    console.log("aaaaaaa")
    let countOfBlock = await db.countOfBlock(mybid[0].bid);
    console.log(countOfBlock)
    if (countOfBlock[0].count >= 3 && accept_number[0].accept_number == 3) {
        let r = await db.updatebid(mybid[0].bid, req.body.applier);
        let r2 = await db.updatenstatus(mybid[0].bid, req.body.applier);
    }
    if (countOfBlock[0].count < 3 && accept_number[0].accept_number == countOfBlock[0].count) {
        let r = await db.updatebid(mybid[0].bid, req.body.applier);
        let r2 = await db.updatenstatus(mybid[0].bid, req.body.applier);
    }
    res.redirect('back');

});
router.get('/map', (req, res) => {
    res.render('map')
});
router.get('/poster', (req, res) => {
    res.render('poster')
});
router.post('/poster', async (req, res) => {
    console.log(req.body);
    console.log(req.user[0].uid);
    var dt = new Date();
    let result1 = await db.insertInThread(req.body.title, req.user[0].uid);
    let result2 = await db.insertInMsg(req.user[0].uid, dt, req.body.textbody);
    let tid = await db.gettid(req.body.title);

    let result3 = await db.insertInThreadmsg(req.body.title, req.user[0].uid);
    let usersarray = [];
    if (req.body.thread_user == "friend") {
        let users = await db.friendlist(req.user[0].uid);
        for (let i = 0; i < users.length; i++) {
            usersarray.push([tid[0].tid, users[i].uid2, null])
        }
        usersarray.push([tid[0].tid, req.user[0].uid, dt]);
    } else if (req.body.thread_user == "neighbor") {
        let users = await db.neighborList(req.user[0].uid)
        for (let i = 0; i < users.length; i++) {
            usersarray.push([tid[0].tid, users[i].uid2, null])
        }
        usersarray.push([tid[0].tid, req.user[0].uid, dt]);
    } else if (req.body.thread_user == "block") {
        let bid = await db.myBlock(req.user[0].uid);
        let users = await db.friendrecommend(bid[0].bid, req.user[0].uid);
        for (let i = 0; i < users.length; i++) {
            usersarray.push([tid[0].tid, users[i].uid, null])
        }
        usersarray.push([tid[0].tid, req.user[0].uid, dt]);
    }

    console.log("userarray");
    console.log(usersarray);
    let result4 = await db.insertInThreadUser(usersarray, dt, req.body.title);
    console.log("1");
    console.log(result1);
    console.log("2");
    console.log(result2);
    console.log("3");
    console.log(result3);
    console.log("4");
    console.log(result4);

    res.redirect('back');
});
router.post('/addreply', async (req, res) => {
    console.log(req.body);
    console.log(req.user[0].uid);
    var dt = new Date();
    let result1 = await db.insertInMsg(req.user[0].uid, dt, req.body.textbody);
    let result2 = await db.insertInThreadmsg(req.body.title, req.user[0].uid);
    res.redirect('back');
});



router.get('/leaveblock', async (req, res) => {
    let result = await db.leavebid(req.user[0].uid);
    res.redirect('back');
});
router.post('/searchmessage', async(req, res)=>{
    console.log("searchmessage");
    console.log(req.user[0].uid);
    console.log(req.body.searchtext);
    let textbody = "%"+req.body.searchtext+"%";
    console.log(textbody);
    let result = await db.searchtextbody(textbody,req.user[0].uid);
    console.log(result);
    res.render('searchmessage',{
        result:result
    });
});



module.exports = router;