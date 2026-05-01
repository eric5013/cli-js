// fetchTrainingRecord.js
var versionID = "20260501"

// base AUTH Identification
var IFLY_TOKEN = ""
// define Global Variable
var cookies = {}
var trainingRecordResult = []
var qualListResult = []
var skillLevelResult = []
var personDataResult = []
var trainingCheckListResult = []
var flyTimeViaStageResult = []
var flyTimeViaDateResult = []
var flyTimeTotalResult = []
var flyTaskViaNumResult = []

// var staffJSZB = [...] Load on WPS
var sfb_NewStaff = []
var newStaffAll = []

var newFODate = []
var newFO = []
// 核心函数定义
var ezIeb = {
    trainingRecord:{
        init:()=>{
            trainingRecordResult = []
            getCookies();
        },
        getViaStaffNum:(staffNum) => {
            var tThis = ezIeb.trainingRecord
            tThis.init()
            tThis.fetch(staffNum)
        },
        getViaStaffList:(staffList) =>{
            // init
            var tThis = ezIeb.trainingRecord
            tThis.init()
            for(var i=0;i<staffList.length;i++){
                tThis.fetch(staffList[i])
            }
        },
        fetch:(staffNum = 198273)=>{
            fetch(`https://ifly.csair.com/api/profile-app/train/trainResult?queryType=1&staffNum=${staffNum}&pageSize=1000&pageNum=1&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                // 数据处理:staffId添加员工号
                var eData = data.data.list
                for(var j=0;j<eData.length;j++){
                    if(eData[j].staffId !== ""){
                        eData[j].staffId = staffNum
                    }
                }
                // 数据导出
                trainingRecordResult.push(eData)
                console.log("fetchTrainingRecordviaStuffNum",staffNum,"Completed")
            }) // 处理数据
            .catch((error) => console.error('fetchTrainingRecordviaStaffNum on Error:', staffNum, error)); // 捕获错误
        },
        down:(pageSize = 180)=>{
            exportMergedBigData(trainingRecordResult,"trainingRecord-培训记录导出",pageSize)
        }
    },
    trainingCheckList:{
        init:()=>{
            trainingCheckListResult = []
            getCookies();
        },
        getViaStaffNum:(staffNum) => {
            var tThis = ezIeb.trainingCheckList
            tThis.init()
            tThis.fetch(staffNum)
        },
        getViaStaffList:(staffList) =>{
            // init
            var tThis = ezIeb.trainingCheckList
            tThis.init()
            for(var i=0;i<staffList.length;i++){
                tThis.fetch(staffList[i])
            }
        },
        fetch:(staffNum = 198273)=>{
            //     https://ifly.csair.com/api/profile-app/train/trainCheckList?queryType=1&staffNum=198304&fleetCd=&qualCd=&trainName=&r=1769519282231
            fetch(`https://ifly.csair.com/api/profile-app/train/trainCheckList?queryType=1&staffNum=${staffNum}&fleetCd=&qualCd=&trainName=&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                // 数据处理:staffId添加员工号
                var eData = data.data
                for(var j=0;j<eData.length;j++){
                    if(eData[j].staffId !== ""){
                        eData[j].staffId = staffNum
                    }
                }
                // 数据导出
                trainingCheckListResult.push(eData)
                console.log("fetchTrainingCheckListviaStuffNum",staffNum,"Completed")
            }) // 处理数据
            .catch((error) => console.error('fetchTrainingCheckListviaStaffNum on Error:', staffNum, error)); // 捕获错误
        },
        down:(pageSize = 170)=>{
            exportMergedBigData(trainingCheckListResult,"trainingChecklist-检查记录导出",pageSize)
        }
    },
    qualList:{
        init:()=>{
            qualListResult = []
            getCookies();
        },
        getViaStaffNum:(staffNum) => {
            var tThis = ezIeb.qualList
            tThis.init()
            tThis.fetch(staffNum)
        },
        getViaStaffList:(staffList) =>{
            // init
            var tThis = ezIeb.qualList
            tThis.init()
            for(var i=0;i<staffList.length;i++){
                tThis.fetch(staffList[i])
            }
        },
        fetch:(staffNum = 198273)=>{
            // "https://ifly.csair.com/api/profile-app/qual/qualList?staffNum=198273&showHistory=false&r=1768802358281"
            fetch(`https://ifly.csair.com/api/profile-app/qual/qualList?staffNum=${staffNum}&showHistory=false&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                // 数据处理:新增staffId,staffId添加员工号
                var eData = data.data
                for(var j=0;j<eData.length;j++){
                        eData[j].staffId = staffNum
                }
                // 数据导出
                qualListResult.push(eData)
                console.log("fetchQualListViaStaffNum",staffNum,"Completed")
            }) // 处理数据
            .catch((error) => console.error('fetchQualListViaStaffNum on Error:', staffNum, error)); // 捕获错误
        },
        down:()=>{
            exportMergedData(qualListResult,"运行资格导出")
        }
    },
    skillLevel:{
        init:()=>{
            skillLevelResult = []
            getCookies();
        },
        getViaStaffNum:(staffNum) => {
            var tThis = ezIeb.skillLevel
            tThis.init()
            tThis.fetch(staffNum)
        },
        getViaStaffList:(staffList) =>{
            // init
            var tThis = ezIeb.skillLevel
            tThis.init()
            for(var i=0;i<staffList.length;i++){
                tThis.fetch(staffList[i])
            }
        },
        fetch:(staffNum = 198273)=>{
            fetch(`https://ifly.csair.com/api/profile-app/qual/skillLevelList?staffNum=${staffNum}&showHistory=true&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                // 数据处理:新增staffId,staffId添加员工号
                var eData = data.data
                for(var j=0;j<eData.length;j++){
                        eData[j].staffId = staffNum
                }
                // 数据导出
                skillLevelResult.push(eData)
                console.log("fetchSkillLevelList",staffNum,"Completed")
            }) // 处理数据
            .catch((error) => console.error('fetchSkillLevelList on Error:', staffNum, error)); // 捕获错误
        },
        down:()=>{
            exportMergedData(skillLevelResult,"技术等级导出")
        }
    },
    personData:{
        init:()=>{
            personDataResult = []
            getCookies();
        },
        getViaStaffNum:(staffNum) => {
            var tThis = ezIeb.personData
            tThis.init()
            tThis.fetch(staffNum)
        },
        getViaStaffList:(staffList) =>{
            // init
            var tThis = ezIeb.personData
            tThis.init()
            for(var i=0;i<staffList.length;i++){
                tThis.fetch(staffList[i])
            }
        },
        fetch:(staffNum = 198273)=>{
            var tThis = ezIeb.personData
            fetch(`https://ifly.csair.com/api/profile-app/basic/cover?staffNum=${staffNum}&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                if(data.code == 200){
                    // 数据处理:staffId添加员工号
                    var eData = data.data
                    eData.staffId = staffNum
                    // 数据处理:解码执照号&手机号 -> utils
                    eData.mobile = tThis.utils.decrypt(eData.mobile)
                    eData.identityNum = tThis.utils.decrypt(eData.identityNum)

                    // 数据导出
                    personDataResult.push(eData)
                    console.log("fetchPersonInfoviaStuffNum",staffNum,"Completed")
                }else{
                    console.error('fetchPersonInfoviaStaffNum on Error:', staffNum, data.msg)
                }
            }) // 处理数据
            .catch((error) => console.error('fetchPersonInfoviaStaffNum on Error:', staffNum, error)); // 捕获错误
        },
        down:()=>{
            exportData(personDataResult,"personData-人员信息导出")
        },
        utils:{
            decrypt:(e)=>{
                if (!e) return e;
                try {
                    const t = atob(e);
                    const i = new Uint8Array(t.length);
                    
                    for (let a = 0; a < t.length; a++) {
                        i[a] = t.charCodeAt(a);
                    }
                    const s = [];
                    for (let a = 0; a < i.length; a += 2) {
                        const e = i[a] << 8 | (255 & i[a + 1]);
                        s.push(e);
                    }
                    const n = s.map((e) => ~e);
                    return String.fromCharCode(...n);
                } catch (error) {
                    console.error('解密失败:', error);
                    return null;
                }
            }
        }
    },
    flyTime:{
        viaStage:{
            //基于阶段获取
            init:()=>{
                flyTimeViaStageResult = []
                getCookies();
            },
            getViaStaffNum:(staffNum) => {
                var tThis = ezIeb.flyTime.viaStage
                tThis.init()
                tThis.fetch(staffNum)
            },
            getViaStaffList:(staffList) =>{
                // init
                var tThis = ezIeb.flyTime.viaStage
                tThis.init()
                for(var i=0;i<staffList.length;i++){
                    tThis.fetch(staffList[i])
                }
            },
            fetch:(staffNum = 198273)=>{
                //     https://ifly.csair.com/api/profile-app/flyTime/stage?staffNum=298956     &queryType=1&pageSize=999&pageNum=1&r=1769740566997
                fetch(`https://ifly.csair.com/api/profile-app/flyTime/stage?staffNum=${staffNum}&queryType=1&pageSize=999&pageNum=1&r=${Date.now()}`, {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "cache-control": "no-cache",
                        "ifly-token": IFLY_TOKEN,
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://ifly.csair.com/",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                })
                .then(response => response.json()) // 解析JSON格式的响应体
                .then(data => {
                    // 数据处理:新增staffId,staffId添加员工号
                    var eData = data.data.list
                    for(var j=0;j<eData.length;j++){
                            eData[j].staffId = staffNum
                    }
                    // 数据导出
                    flyTimeViaStageResult.push(eData)
                    console.log("fetchFlytimeViaStage",staffNum,"Completed")
                }) // 处理数据
                .catch((error) => console.error('fetchFlytimeViaStage on Error:', staffNum, error)); // 捕获错误
            },
            down:()=>{
                exportMergedData(flyTimeViaStageResult,"飞行时间导出-viaStage")
            }
        },
        viaDate:{
            // 基于起止日期获取
            init:()=>{
                flyTimeViaDateResult = []
                getCookies();
            },
            getViaStaffNum:(staffArgs) => {
                var tThis = ezIeb.flyTime.viaDate
                tThis.init()
                tThis.fetch(staffArgs)
            },
            getViaStaffList:(staffList) =>{
                // init
                var tThis = ezIeb.flyTime.viaDate
                tThis.init()
                for(var i=0;i<staffList.length;i++){
                    tThis.fetch(staffList[i])
                }
            },
            fetch:(arr = [198273,"2013-01-01",new Date()])=>{
                var staffNum = arr[0]
                var startDate = arr[1]
                var endDate = arr[2]

                var tThis = ezIeb.flyTime.viaDate
                //     https://ifly.csair.com/api/profile-app/flyTime/flyTimeByDate?staffNum=283385&queryType=3&strTime=2026-01-01&endTime=2026-12-31&r=1769873143877
                fetch(`https://ifly.csair.com/api/profile-app/flyTime/flyTimeByDate?staffNum=${staffNum}&queryType=3&strTime=${tThis.utils.getDateDash(startDate)}&endTime=${tThis.utils.getDateDash(endDate)}&r=${Date.now()}`, {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "cache-control": "no-cache",
                        "ifly-token": IFLY_TOKEN,
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://ifly.csair.com/",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                })
                .then(response => response.json()) // 解析JSON格式的响应体
                .then(data => {
                    if(data.code == 200){
                        // 数据处理:staffId添加员工号
                        var eData = data.data[0]
                        eData.staffId = staffNum

                        // 数据导出
                        flyTimeViaDateResult.push(eData)
                        console.log("fetchFlyTimeViaDateviaStuffNum",staffNum,"Completed")
                    }else{
                        console.error('fetchFlyTimeViaDateviaStaffNum on Error:', staffNum, data.msg)
                    }
                }) // 处理数据
                .catch((error) => console.error('fetchFlyTimeViaDateviaStaffNum on Error:', staffNum, error)); // 捕获错误
            },
            down:()=>{
                exportData(flyTimeViaDateResult,"飞行时间导出")
            },
            utils:{
                getDateDash:(dt)=>{
                    var now = new Date(dt);
                    var year = now.getFullYear();
                    var month = now.getMonth() + 1 < 10? `0${now.getMonth() + 1}`:now.getMonth() + 1; // 月份是从0开始的，所以要加1
                    var date = now.getDate() < 10? `0${now.getDate()}`:now.getDate();
                    return `${year}-${month}-${date}`
                }
            }
        },
        viaIebDate:{//仅用于120天100小时经历导出
            // 基于起止日期获取
            init:()=>{
                flyTimeViaDateResult = []
                getCookies();
            }
            ,
            getViaStaffNum:(staffArgs) => {
                var tThis = ezIeb.flyTime.viaIebDate
                tThis.init()
                tThis.fetch(staffArgs)
            },
            getViaStaffList:(staffList) =>{
                // init
                var tThis = ezIeb.flyTime.viaIebDate
                tThis.init()
                for(var i=0;i<staffList.length;i++){
                    tThis.fetch(staffList[i])
                }
            },
            fetch:async function(arr = [198273,"2013-01-01",new Date()]){
                var staffNum = arr[0]
                var startDate = arr[1]
                var endDate = arr[2]
                var tThis = ezIeb.flyTime.viaIebDate
                try{
                await loadJqueryJS()
                //     https://ieb.csair.com/newieb/flytime/showFlytimeManyQueryList?staffNum=277581&activeStatusArray=ZAIZHI&fleetCdArray1=&fleetCdArray=&chnDescArray=&primaryBaseArray=&baseArray=&dateType=5&exportType=1&startStr=2026-01-01&endStr=2026-02-02&singlefleetCdArray=&chnDescArray1=&page=1&currentStr=1769996434992
                $.get(`https://ieb.csair.com/newieb/flytime/showFlytimeManyQueryList?staffNum=${staffNum}&activeStatusArray=ZAIZHI&fleetCdArray1=&fleetCdArray=&chnDescArray=&primaryBaseArray=&baseArray=&dateType=5&exportType=1&startStr=${tThis.utils.getDateDash(startDate)}&endStr=${tThis.utils.getDateDash(endDate)}&singlefleetCdArray=&chnDescArray1=&page=1&currentStr=${Date.now()}`)
                .done(function(res) {
                    var rThis = $(res)[0]
                    console.log(rThis)

                    var result = {
                    staffId:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(1)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    staffName:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(2)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    currentLevel:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(5)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    startDate:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(6)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    endDate:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(7)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    expThrTotal:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(9)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    legNum:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(10)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    leftThr:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(12)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    rightThr:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(13)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    totalControl:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(16)").innerText.replaceAll("\n","").replaceAll("\t",""),
                    hxControl:rThis.querySelector("div.staticPage.newPage > div > div > div > table > tbody > tr > td:nth-child(17)").innerText.replaceAll("\n","").replaceAll("\t","")
                }
                flyTimeViaDateResult.push(result)
                console.log("fetchFlyTimeViaDateviaStuffNum",staffNum,"Completed")
                })
            } catch (error) {console.error('fetchFlyTimeViaDateviaStaffNum on Error:', staffNum, error)}
            },
            down:()=>{
                exportData(flyTimeViaDateResult,"飞行时间导出-iebDate")
            },
            utils:{
                getDateDash:(dt)=>{
                    var now = new Date(dt);
                    var year = now.getFullYear();
                    var month = now.getMonth() + 1 < 10? `0${now.getMonth() + 1}`:now.getMonth() + 1; // 月份是从0开始的，所以要加1
                    var date = now.getDate() < 10? `0${now.getDate()}`:now.getDate();
                    return `${year}-${month}-${date}`
                }
            } 
        },
        total:{
            init:()=>{
                flyTimeTotalResult = []
                getCookies();
            },
            getViaStaffNum:(staffNum) => {
                var tThis = ezIeb.flyTime.total
                tThis.init()
                tThis.fetch(staffNum)
            },
            getViaStaffList:(staffList) =>{
                // init
                var tThis = ezIeb.flyTime.total
                tThis.init()
                for(var i=0;i<staffList.length;i++){
                    tThis.fetch(staffList[i])
                }
            },
            fetch:(staffNum = 198273)=>{
                var tThis = ezIeb.flyTime.total
                fetch(`https://ifly.csair.com/api/profile-app/basic/cover?staffNum=${staffNum}&r=${Date.now()}`, {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "cache-control": "no-cache",
                        "ifly-token": IFLY_TOKEN,
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://ifly.csair.com/",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                })
                .then(response => response.json()) // 解析JSON格式的响应体
                .then(data => {
                    if(data.code == 200){
                        // 数据处理:staffId添加员工号
                        var eData = data.data.flyTimeQueryReturnDTO
                        eData.staffId = staffNum
                        // 数据处理:解码执照号&手机号 -> utils
                        // eData.mobile = tThis.utils.decrypt(eData.mobile)
                        // eData.identityNum = tThis.utils.decrypt(eData.identityNum)

                        // 数据导出
                        flyTimeTotalResult.push(eData)
                        console.log("fetchFlyTimeTotalviaStuffNum",staffNum,"Completed")
                    }else{
                        console.error('fetchFlyTimeTotalviaStaffNum on Error:', staffNum, data.msg)
                    }
                }) // 处理数据
                .catch((error) => console.error('fetchFlyTimeTotalviaStaffNum on Error:', staffNum, error)); // 捕获错误
            },
            down:()=>{
                exportData(flyTimeTotalResult,"飞行时间导出-total")
            },
            utils:{
                decrypt:(e)=>{
                    if (!e) return e;
                    try {
                        const t = atob(e);
                        const i = new Uint8Array(t.length);
                        
                        for (let a = 0; a < t.length; a++) {
                            i[a] = t.charCodeAt(a);
                        }
                        const s = [];
                        for (let a = 0; a < i.length; a += 2) {
                            const e = i[a] << 8 | (255 & i[a + 1]);
                            s.push(e);
                        }
                        const n = s.map((e) => ~e);
                        return String.fromCharCode(...n);
                    } catch (error) {
                        console.error('解密失败:', error);
                        return null;
                    }
                }
            }
        },
    },
    passport:{
        init:()=>{
            passportResult = []
            getCookies();
        },
        getViaStaffNum:(staffNum) => {
            var tThis = ezIeb.passport
            tThis.init()
            tThis.fetch(staffNum)
        },
        getViaStaffList:(staffList) =>{
            // init
            var tThis = ezIeb.passport
            tThis.init()
            for(var i=0;i<staffList.length;i++){
                tThis.fetch(staffList[i])
            }
        },
        fetch:(staffNum = 198273)=>{
            //     https://ifly.csair.com/api/profile-app/license/passport?staffNum=198273&r=1771035810706
            fetch(`https://ifly.csair.com/api/profile-app/license/passport?staffNum=${staffNum}&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                // 数据处理:新增staffId,staffId添加员工号
                var eData = data.data
                for(var j=0;j<eData.length;j++){
                        eData[j].staffId = staffNum
                }
                // 数据导出
                passportResult.push(eData)
                console.log("fetchPassport",staffNum,"Completed")
            }) // 处理数据
            .catch((error) => console.error('fetchPassport', staffNum, error)); // 捕获错误
        },
        down:()=>{
            exportMergedData(passportResult,"passport-护照签证导出")
        }
    },
    flyTask:{
        viaFlightNum:{
        init:()=>{
            flyTaskViaNumResult = []
            getCookies();
        },
        getViaFlightNum:(flightNum) => {
            var tThis = ezIeb.flyTask.viaFlightNum
            tThis.init()
            tThis.fetch(flightNum)
        },
        getViaFlightNumList:(flightNumList) =>{
            // init
            var tThis = ezIeb.flyTask.viaFlightNum
            tThis.init()
            for(var i=0;i<flightNumList.length;i++){
                tThis.fetch(flightNumList[i])
            }
        },
        fetch:(fltNum = "0427",startDate = '20260217',endDate = "20260226")=>{
            fetch(`https://ifly.csair.com/api/os-app/flightTask/page?pageNum=1&pageSize=9999&fltNum=${fltNum}&depCd=&arvCd=&startDate=${startDate}&endDate=${endDate}&r=${Date.now()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://ifly.csair.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })
            .then(response => response.json()) // 解析JSON格式的响应体
            .then(data => {
                // 数据处理:新增flightNum，添加航班号
                var eData = data.data.list
                for(var j=0;j<eData.length;j++){
                        eData[j].fltNum = fltNum
                }
                // 数据导出
                flyTaskViaNumResult.push(eData)
                console.log("fetchFlyTaskViaNum",fltNum,"Completed")
            }) // 处理数据
            .catch((error) => console.error('fetchFlyTaskViaNum on Error:', fltNum, error)); // 捕获错误
        },
        down:()=>{
            exportMergedData(flyTaskViaNumResult,"航班任务导出")
        }
        }
    },
    auto:{
         get:(staffList = staffJSZB)=>{
            if(typeof staffList !== 'object'){
                alert("staffList 未定义！")
                return
            }
            setTimeout(()=>ezIeb.trainingRecord.getViaStaffList(staffList),100)
            setTimeout(()=>ezIeb.trainingCheckList.getViaStaffList(staffList),15000)
            setTimeout(()=>ezIeb.qualList.getViaStaffList(staffList),30000)
            setTimeout(()=>ezIeb.skillLevel.getViaStaffList(staffList),45000)
            setTimeout(()=>ezIeb.personData.getViaStaffList(staffList),60000)
            // 新增护照导出
            setTimeout(()=>ezIeb.passport.getViaStaffList(staffList),80000)
            // 飞行时间导出
            setTimeout(()=>ezIeb.flyTime.viaStage.getViaStaffList(staffList),100000)
            setTimeout(()=>ezIeb.flyTime.total.getViaStaffList(staffList),120000)

         },
         down:()=>{
            ezIeb.trainingRecord.down()
            ezIeb.trainingCheckList.down()
            ezIeb.qualList.down()
            ezIeb.skillLevel.down()
            ezIeb.personData.down()
            ezIeb.passport.down()
            ezIeb.flyTime.viaStage.down()
            ezIeb.flyTime.total.down()
         },
    },
    UI:{
        init:()=>{
            const dom = document.createElement("div")
            dom.innerHTML = `<a class="admin-link font-16 el-link el-link--default">
            <span class="el-link--inner">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAAXNSR0IB2cksfwAAARRQTFRFAAAA////QID/Nnb/XJ7/SYn/U5T/Q4P/S4z/VZf/PXz/To//Pn7/WZv/O3r/Rob/NHP/UJL/V5j/OXj/UoT/XqH/YaP/8vf/Wpz/MnH/W5n/P37/SYj/RYP/MG//UZD/WZn/Ypr/f6r/i7b/hK7/U4z/OXP/ZZ3/+Pv/WJn/X5f/YaX/WZn/Sor/S4v/SYb/V5H/XZX/YqT/L27/QGD/wtj/krj/QoP/Pn7/YqT/PXz/Lmz/RYb/S43/QYL/MG//UZP/PXr/TI3/R4j/2+j/U5b/Q4T/LW3/L2z/QID/qMr/T4//YKP/LW//L2v/QIb/zNz/YqT/T4//L2//Onr/L2//P3//ocL/Pn3/P3//OXX/QHv/8vfFewAAAFx0Uk5TAP////////////////////////8Q//////9AgICA/4CA/////yAg/////99wYHBA//9w3wj//zBwUGhAv5/f73B8r9//v48wrxj/z0iPvyj/n++fgM/v/9+/SDjKjaDfAAAB70lEQVR4nLXTWVvaQBQG4BGILEkAJcRAEk1aAwiCFFHc92q1q3av//9/dObMnOSYJ7Te+F3OvM83c4bA2Etl6/rkh2EYlUq12mg08vl6vd46/f71MMWio1qxmMvlUOalbK2uvutQN7uscZgtt29I36WmZcoWyKTzQhNwbueneI5SSdPmdILEiY5LIGtQmiU/Kvhej2V257aCD/oTySmHVJ4quKQr+bPXW6FZ+FKVEiHKq4VUeprsVHAR5Xh3HfJKZX2sTkcYy3kTEfhvqWB58X+dCGPZ7YZh2O+/4RlTqeAyyh068W4xkQpugOT3zIBSKmguY2e3C4fz0/tjek+EJodlnF1/MpEBv6aCjpl00tlPrt0997dBoIOdVB5tyd2OW6koWHBUZ/haJuTS4xvTjgX0F8JCQUr8KFbKJeFm5+63PyAJBHknv7Lejn4s1n3Xdc/pv7XJZcE0N8hEEV+2PCFvKGw249OlvID1oe+7exaBNkAqh7A+9Xz/kTg2sLFSySX5MjPP84cU3tukE95TXJFZozUuPxO4b6dlm7WDYI3HEwMdkLOVxJcfsv0AJId8oBi2bZBNeCUh37IPQSKTRjax49Ple0bMSjKl1xxgpyMkr5xMNnnOzkaj0S2dPJoMUDqiMyCNLJWoTZPefX7+Ah5xUWwZ0FtwAAAAAElFTkSuQmCC" alt="logo" class="logo home-logo">
            <span>EZ Platform</span>
            </span></a>`
            dom.onclick = ()=>{
                document.querySelector("#mainContent").innerHTML = getCookies().IFLY_TOKEN
                var requestCode = prompt("1","1")
                switch(requestCode){
                    case "1":
                        ezIeb.qualList.auto.getViaStaffList(staffJSZB)
                }
            }
            document.querySelector(".portal-header__body-right").appendChild(dom)
            console.log(`ezIeb CommandLine Tool Version:$(versionID)`)
        },
    }
}

ezConsole = {
    init:()=>{
        document.querySelector("#mainContent").innerHTML = ``
    },
    log:(...text)=>{
        const pDom = document.createElement("p")
        pDom.innerText = text.join(" ")
        console.log(text)
        document.querySelector("#mainContent").appendChild(pDom)
    }
}

// 加载SheetJS库
function loadSheetJS() {
    return new Promise((resolve, reject) => {
        if (typeof XLSX !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
// 加载jquery
function loadJqueryJS() {
    return new Promise((resolve, reject) => {
        if (typeof jQuery !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预处理数据 - 将JSON对象转换为字符串
function preprocessData(data) {
    return data.map(item => {
        const processed = {};
        for (const key in item) {
            const value = item[key];
            processed[key] = (typeof value === 'object' && value !== null) 
                ? JSON.stringify(value) 
                : value;
        }
        return processed;
    });
}

// 将多个数组合并为一个Excel工作表
function mergeArraysToWorkbook(arrays) {
    // 合并所有数组
    const mergedData = arrays
          .filter(array => Array.isArray(array) && array.length > 0) // 过滤空数组
          .reduce((acc, array) => acc.concat(array), [])
          .map(data => preprocessData([data])[0]); // 预处理每个数据项
    
    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mergedData);
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "合并数据");
    
    return wb;
}
function arraysToWorkbook(arrays) {
    // 处理数组
    const mergedData = arrays
          .map(data => preprocessData([data])[0]); // 预处理每个数据项
    console.log(mergedData)
    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mergedData);
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "合并数据");
    
    return wb;
}

// 下载Excel文件
function downloadExcel(workbook, filename = 'merged-data') {
    XLSX.writeFile(workbook, filename);
    console.log(`文件已下载: ${filename}`);
}

function getNowDash(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // 月份是从0开始的，所以要加1
    var date = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    return `${year}-${month}-${date}-${hours}-${minutes}-${seconds}`
}


// 完整导出流程-无合并数组
async function exportData(arrays, filename) {
    try {
        await loadSheetJS();
        const workbook = arraysToWorkbook(arrays);
        downloadExcel(workbook, `${filename}-${getNowDash()}.xlsx`);
    } catch (error) {
        console.error('导出失败:', error);
    }
}
// 完整导出流程
async function exportMergedData(arrays, filename) {
    try {
        await loadSheetJS();
        const workbook = mergeArraysToWorkbook(arrays);
        downloadExcel(workbook, `${filename}-${getNowDash()}.xlsx`);
    } catch (error) {
        console.error('导出失败:', error);
    }
}
// 完整导出流程-数据切片
async function exportMergedBigData(arrays, filename,pageSize = 100) {
    try {
        await loadSheetJS();
        for(var pgNum = 0;pgNum < arrays.length / pageSize + 0.1;pgNum++){
            console.log(pgNum)
            var workbook = mergeArraysToWorkbook(arrays.slice(pgNum * pageSize,(pgNum+1) * pageSize));
            downloadExcel(workbook, `${filename}-序号-${pgNum + 1}-${getNowDash()}.xlsx`);
        }
    } catch (error) {
        console.error('导出失败:', error);
    }
}

// 获取iFLY_TOKEN
function getCookies() {
  var cookies = document.cookie.split('; ');
  var result = {};
  
  cookies.forEach(function(cookie) {
    var parts = cookie.split('=');
    var key = decodeURIComponent(parts[0]);
    var value = decodeURIComponent(parts[1]);
    
    result[key] = value;
  });
  IFLY_TOKEN = result.IFLY_TOKEN
  cookies = result
  return result;
}

window.onload = ()=>{setTimeout(()=>ezIeb.UI.init(),4000)}
