// fetchTrainingRecord.js

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
var flyTaskViaNumResult = []

// var staffJSZB = [...] Load on WPS
var sfb_NewStaff = ["905048","212867","901526","186645","901631","904808","905049","905212","277581","298130","297720","297722","298120","298956"]
var newStaffAll = ["202860","213437","901741","901792","209640","210822","901407","901474","901622","186645","901526","901631","904808","213851","901382","903946","277581","294533","294944","295869","297719","297720","297722","298120","298122","298126","298130","282150","283385","294942","297721"]

var newFODate = [['217103','2020-12-31','2021-04-30'],['217103','2021-06-10','2021-10-08'],['217103','2020-06-01','2020-09-29'],['217103','2020-12-28','2021-04-27'],['217103','2021-06-07','2021-10-05'],['217103','2021-06-08','2021-10-06'],['217103','2021-12-10','2022-04-09'],['217103','2021-12-11','2022-04-10'],['217103','2022-06-18','2022-10-16'],['217103','2022-11-29','2023-03-29'],['217103','2022-12-01','2023-03-31'],['217103','2023-12-08','2024-04-06'],['217103','2023-12-09','2024-04-07'],['217103','2025-02-20','2025-06-20'],['217103','2025-08-17','2025-12-15'],['217103','2025-08-18','2025-12-16'],['217103','2025-02-22','2025-06-22'],['258456','2024-02-03','2024-06-02'],['258456','2023-12-17','2024-04-15'],['258456','2024-02-02','2024-06-01'],['258456','2024-02-03','2024-06-02'],['258456','2024-08-10','2024-12-08'],['258456','2024-08-11','2024-12-09'],['258456','2025-02-01','2025-06-01'],['258456','2025-08-22','2025-12-20'],['258456','2025-02-04','2025-06-04'],['258456','2023-08-13','2023-12-11'],['260936','2023-05-18','2023-09-15'],['260936','2023-12-16','2024-04-14'],['260936','2023-12-17','2024-04-15'],['260936','2024-05-21','2024-09-18'],['260936','2024-05-22','2024-09-19'],['260936','2024-12-02','2025-04-01'],['260936','2024-12-03','2025-04-02'],['260936','2025-05-29','2025-09-26'],['260936','2025-05-30','2025-09-27'],['260936','2025-11-17','2026-03-17'],['260936','2025-11-18','2026-03-18'],['260936','2023-01-03','2023-05-03'],['271946','2023-01-20','2023-05-20'],['271946','2023-03-07','2023-07-05'],['271946','2023-09-04','2024-01-02'],['271946','2023-09-05','2024-01-03'],['271946','2024-03-27','2024-07-25'],['271946','2024-10-05','2025-02-02'],['271946','2024-10-06','2025-02-03'],['271946','2025-03-19','2025-07-17'],['271946','2025-03-20','2025-07-18'],['271946','2025-09-17','2026-01-15'],['271946','2025-09-18','2026-01-16'],['271946','2022-09-11','2023-01-09'],['272816','2023-04-16','2023-08-14'],['272816','2022-05-17','2022-09-14'],['272816','2022-12-03','2023-04-02'],['272816','2023-12-08','2024-04-06'],['272816','2023-12-09','2024-04-07'],['272816','2024-06-19','2024-10-17'],['272816','2024-06-20','2024-10-18'],['272816','2024-12-11','2025-04-10'],['272816','2024-12-12','2025-04-11'],['272816','2025-06-09','2025-10-07'],['272816','2025-06-10','2025-10-08'],['272816','2025-12-05','2026-04-04'],['272816','2025-12-06','2026-04-05'],['272816','2022-03-31','2022-07-29'],['272816','2022-08-21','2022-12-19'],['276032','2024-02-19','2024-06-18'],['276032','2023-10-25','2024-02-22'],['276032','2023-10-26','2024-02-23'],['276032','2024-05-15','2024-09-12'],['276032','2024-05-16','2024-09-13'],['276032','2024-11-26','2025-03-26'],['276032','2024-11-27','2025-03-27'],['276032','2025-05-13','2025-09-10'],['276032','2025-05-14','2025-09-11'],['276032','2025-11-22','2026-03-22'],['276032','2025-11-23','2026-03-23'],['276032','2023-06-15','2023-10-13'],['276705','2024-01-28','2024-05-27'],['276705','2024-03-30','2024-07-28'],['276705','2024-03-31','2024-07-29'],['276705','2024-07-31','2024-11-28'],['276705','2024-08-01','2024-11-29'],['276705','2025-03-25','2025-07-23'],['276705','2025-03-26','2025-07-24'],['276705','2025-09-15','2026-01-13'],['276705','2025-09-16','2026-01-14'],['276705','2023-10-14','2024-02-11'],['277573','2024-06-10','2024-10-08'],['277573','2024-08-05','2024-12-03'],['277573','2024-08-06','2024-12-04'],['277573','2025-02-01','2025-06-01'],['277573','2025-02-02','2025-06-02'],['277573','2025-07-30','2025-11-27'],['277573','2025-07-31','2025-11-28'],['277573','2025-02-04','2025-06-04'],['277573','2024-02-08','2024-06-07'],['277581','2025-09-03','2026-01-01'],['277581','2025-04-26','2025-08-24'],['277581','2025-04-27','2025-08-25'],['277581','2025-11-04','2026-03-04'],['277581','2025-11-05','2026-03-05'],['277581','2024-12-15','2025-04-14'],['277582','2023-02-07','2023-06-07'],['277582','2023-08-10','2023-12-08'],['277582','2023-08-11','2023-12-09'],['277582','2024-01-04','2024-05-03'],['277582','2024-01-05','2024-05-04'],['277582','2024-07-01','2024-10-29'],['277582','2025-01-27','2025-05-27'],['277582','2025-01-28','2025-05-28'],['277582','2025-08-17','2025-12-15'],['277582','2025-08-18','2025-12-16'],['277582','2026-01-04','2026-05-04'],['277582','2026-01-05','2026-05-05'],['277582','2025-01-30','2025-05-30'],['277582','2022-10-31','2023-02-28'],['278103','2025-05-14','2025-09-11'],['278103','2025-05-15','2025-09-12'],['278103','2025-11-27','2026-03-27'],['278103','2025-11-28','2026-03-28'],['278103','2025-05-18','2025-09-15'],['278103','2025-01-10','2025-05-10'],['280202','2025-03-22','2025-07-20'],['280202','2025-03-23','2025-07-21'],['280202','2025-10-04','2026-02-01'],['280202','2025-10-05','2026-02-02'],['280202','2024-11-09','2025-03-09'],['280951','2025-06-22','2025-10-20'],['280951','2024-09-28','2025-01-26'],['280951','2024-09-29','2025-01-27'],['280951','2025-02-09','2025-06-09'],['280951','2025-02-10','2025-06-10'],['280951','2025-08-31','2025-12-29'],['280951','2025-09-01','2025-12-30'],['280951','2025-02-12','2025-06-12'],['280951','2024-04-12','2024-08-10'],['282150','2024-09-19','2025-01-17'],['282150','2024-09-20','2025-01-18'],['282150','2025-04-12','2025-08-10'],['282150','2025-04-16','2025-08-14'],['282150','2025-09-26','2026-01-24'],['282150','2025-09-27','2026-01-25'],['282150','2024-04-12','2024-08-10'],['282653','2025-09-01','2025-12-30'],['282653','2025-09-02','2025-12-31'],['282653','2025-05-01','2025-08-29'],['283370','2025-06-30','2025-10-28'],['283370','2025-07-01','2025-10-29'],['283370','2025-02-07','2025-06-07'],['283385','2026-01-03','2026-05-03'],['283385','2025-09-03','2026-01-01'],['283385','2025-09-04','2026-01-02'],['283385','2025-05-12','2025-09-09'],['283389','2025-01-10','2025-05-10'],['283389','2024-09-11','2025-01-09'],['283389','2024-09-12','2025-01-10'],['283389','2025-03-15','2025-07-13'],['283389','2025-03-16','2025-07-14'],['283389','2025-08-28','2025-12-26'],['283389','2025-08-29','2025-12-27'],['283389','2024-04-06','2024-08-04'],['283832','2025-07-19','2025-11-16'],['283832','2025-07-21','2025-11-18'],['283832','2025-03-14','2025-07-12'],['287138','2025-10-05','2026-02-02'],['287138','2025-10-06','2026-02-03'],['287138','2025-06-13','2025-10-11'],['287628','2025-09-11','2026-01-09'],['287628','2025-05-09','2025-09-06'],['289664','2025-06-22','2025-10-20'],['289664','2025-01-01','2025-05-01'],['289664','2025-01-02','2025-05-02'],['289664','2025-08-05','2025-12-03'],['289664','2025-08-06','2025-12-04'],['289664','2026-01-08','2026-05-08'],['289664','2026-01-09','2026-05-09'],['289664','2025-01-03','2025-05-03'],['289664','2024-08-19','2024-12-17'],['290013','2025-05-15','2025-09-12'],['290013','2025-05-16','2025-09-13'],['290013','2025-11-13','2026-03-13'],['290013','2025-11-14','2026-03-14'],['290013','2025-01-13','2025-05-13'],['291375','2025-07-06','2025-11-03'],['291375','2025-07-07','2025-11-04'],['291375','2025-02-07','2025-06-07'],['292689','2025-09-03','2026-01-01'],['292689','2025-10-13','2026-02-10'],['292689','2025-10-14','2026-02-11'],['292689','2025-05-13','2025-09-10'],['292693','2025-09-26','2026-01-24'],['292693','2025-05-15','2025-09-12'],['292694','2025-07-21','2025-11-18'],['292694','2025-07-22','2025-11-19'],['292694','2025-03-07','2025-07-05'],['292696','2025-09-21','2026-01-19'],['292696','2025-09-22','2026-01-20'],['292696','2025-05-14','2025-09-11'],['294090','2025-10-16','2026-02-13'],['294090','2025-10-17','2026-02-14'],['294090','2025-06-13','2025-10-11'],['294091','2025-10-01','2026-01-29'],['294091','2025-10-02','2026-01-30'],['294091','2025-06-11','2025-10-09'],['294092','2025-07-28','2025-11-25'],['294092','2025-07-29','2025-11-26'],['294092','2025-03-11','2025-07-09'],['294533','2025-12-07','2026-04-06'],['294942','2025-12-24','2026-04-23'],['294942','2025-09-07','2026-01-05'],['294944','2025-11-02','2026-03-02'],['294949','2025-12-02','2026-04-01'],['294949','2025-12-03','2026-04-02'],['294949','2025-07-11','2025-11-08'],['295869','2025-10-01','2026-01-29'],['297719','2025-10-01','2026-01-29'],['297720','2025-10-01','2026-01-29'],['297721','2025-12-24','2026-04-23'],['297721','2025-09-09','2026-01-07'],['297722','2025-11-02','2026-03-02'],['298120','2025-12-05','2026-04-04'],['298122','2025-12-07','2026-04-06'],['298126','2025-12-05','2026-04-04'],['298130','2026-01-03','2026-05-03'],['298130','2025-09-09','2026-01-07'],['298132','2025-11-11','2026-03-11'],['298132','2025-11-12','2026-03-12'],['298132','2025-07-12','2025-11-09'],['901662','2026-01-14','2026-05-14'],['905212','2026-01-14','2026-05-14']]
var newFO = ["297719","298126","294533","298130","277581","297720","297722","298120","295869","294944","298122"]
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
        down:(pageSize = 200)=>{
            exportMergedBigData(trainingRecordResult,"培训记录导出",pageSize)
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
        down:(pageSize = 180)=>{
            exportMergedBigData(trainingCheckListResult,"检查记录导出",pageSize)
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
                    // eData.mobile = tThis.utils.decrypt(eData.mobile)
                    // eData.identityNum = tThis.utils.decrypt(eData.identityNum)

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
            exportData(personDataResult,"人员信息导出")
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
                exportMergedData(flyTimeViaStageResult,"飞行时间导出")
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
        }
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
            exportMergedData(passportResult,"护照签证导出")
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
         getViaStaffNum:(staffList)=>{
            setTimeout(()=>ezIeb.trainingRecord.getViaStaffList(staffList),100)
            setTimeout(()=>ezIeb.trainingCheckList.getViaStaffList(staffList),15000)
            setTimeout(()=>ezIeb.qualList.getViaStaffList(staffList),30000)
            setTimeout(()=>ezIeb.skillLevel.getViaStaffList(staffList),45000)
            setTimeout(()=>ezIeb.personData.getViaStaffList(staffList),60000)
         },
         down:()=>{
            ezIeb.trainingRecord.down()
            ezIeb.trainingCheckList.down()
            ezIeb.qualList.down()
            ezIeb.skillLevel.down()
            ezIeb.personData.down()
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
            var workbook = mergeArraysToWorkbook(arrays.slice(pgNum * pageSize,(pgNum+1) * pageSize - 1));
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