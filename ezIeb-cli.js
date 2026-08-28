// =============================================================
// ezIeb-cli.js  (完整重构版 - 单文件)
// Version: 20260522-FIXED
// =============================================================

// ==============================
// 全局变量
// ==============================
var versionID = "20260828";

var IFLY_TOKEN = "";
var cookies = {};

var trainingRecordResult = [];
var qualListResult = [];
var skillLevelResult = [];
var personDataResult = [];
var trainingCheckListResult = [];
var flyTimeViaStageResult = [];
var flyTimeViaDateResult = [];
var flyTimeTotalResult = [];
var flyTaskViaNumResult = [];
var flyDetailResult = [];
var passportResult = [];
var medicalCertResult = []

var staffJSZB = [];
var sfb_NewStaff = [];
var newStaffAll = [];
// var newFODate = [];
// var newFO = [];

const ezFetcher = {
    concurrency: 4,

    /* 单请求 */
    async request({ url, staffNum, processor, label }) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        try {
            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
                signal: controller.signal,
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "ifly-token": IFLY_TOKEN,
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand)\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                }
            });

            clearTimeout(timeout);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            if (json.code && json.code !== 200) {
                throw new Error(json.msg || "业务异常");
            }

            const data = processor(json.data ?? json, staffNum);
            return data;
        } catch (err) {
            console.error(`❌ ${label} staff=${staffNum}`, err.message);
            return null;
        }
    },

    async batch({ list, urlBuilder, processor, label, targetArray }) {
        const stats = { total: list.length, done: 0 };
        const queue = list.map(staffNum => ({ staffNum }));
        const collector = [];

        const workers = Array.from({ length: this.concurrency },
            () => this._worker({ queue, urlBuilder, processor, label, stats, collector })
        );

        await Promise.all(workers);

        if (targetArray) {
            targetArray.length = 0;
            targetArray.push(...collector);
        }

        return collector;
    },

    async _worker({ queue, urlBuilder, processor, label, stats, collector }) {
        while (queue.length) {
            const task = queue.shift();
            try {
                const rawData = await this.request({
                    url: urlBuilder(task.staffNum),
                    staffNum: task.staffNum,
                    processor,
                    label
                });

                if (rawData !== null && rawData !== undefined) {
                    if (Array.isArray(rawData)) {
                        collector.push(...rawData);
                    } else {
                        collector.push(rawData);
                    }
                }
            } catch (_) {

            }

            stats.done++;
            this.progress(label, stats);

            // ✅ 给浏览器喘息机会，避免被掐请求
            await new Promise(r => setTimeout(r, 30));
        }
    },

    progress(label, stats) {
        const { done, total } = stats;
        const pct = total > 0 ? Math.min((done / total) * 100, 100).toFixed(1) : "0.0";
        const barLen = Math.min(Math.floor(pct / 2), 50);
        const bar = "█".repeat(barLen);
        console.log(
            `%c[${label}] [${bar.padEnd(50)}] ${pct}% (${done}/${total})`,
            "color:#4caf50;font-weight:bold"
        );
    }
};
// ==============================
// ✅ IEB 专用调度器（HTML 接口，使用 $.get）
// list 格式: [[staffNum, startDate, endDate], ...]
// ==============================
const iebFetcher = {
    concurrency: 4, // IEB 很慢，建议 2
    stats: { total: 0, done: 0 },

    async batch({ list, urlBuilder, processor, label }) {
        const queue = list.slice();
        this.stats.total = queue.length;
        this.stats.done = 0;

        const collector = [];

        const workers = Array.from({ length: this.concurrency }, () =>
            this._worker({ queue, urlBuilder, processor, label, collector })
        );

        await Promise.all(workers);
        return collector;
    },

    async _worker({ queue, urlBuilder, processor, label, collector }) {
        while (queue.length) {
            const task = queue.shift();
            try {
                const html = await this.request(urlBuilder(task));
                const data = processor(html, task);
                if (data) collector.push(data);
            } catch (e) {
                console.error(`❌ ${label} staff=${task[0]}`, e.message);
            }

            this.stats.done++;
            this.progress(label);
            await new Promise(r => setTimeout(r, 50)); // 给 IEB 喘气
        }
    },

    request(url) {
        return new Promise((resolve, reject) => {
            $.get(url)
                .done(html => resolve(html))
                .fail(err => reject(err));
        });
    },

    progress(label) {
        const { done, total } = this.stats;
        const pct = Math.min((done / total) * 100, 100).toFixed(1);
        const bar = "█".repeat(Math.floor(pct / 2));
        console.log(
            `%c[${label}] [${bar.padEnd(50)}] ${pct}% (${done}/${total})`,
            "color:#2196f3"
        );
    },

    /**
     * ✅ 唯一正确的 IEB HTML 解析方法
     * 不依赖 parseHTML 的坑爹行为
     */
    parseTable(html) {
        if (!html) return null;

        // ✅ 关键：挂到临时容器，再当上下文查找
        const $root = $("<div>").html(html);

        // 先查子孙
        let $page = $root.find(".staticPage.newPage");

        // 再兜底：如果 .staticPage.newPage 是顶层并列节点
        if (!$page.length) {
            $page = $root.filter(".staticPage.newPage");
        }

        if (!$page.length) {
            return null;
        }

        const $tr = $page.find("tbody.list tr");
        return $tr.length ? $tr : null;
    }
};


var ezIeb = {
    // ------------------------------
    // 培训记录
    // ------------------------------
    trainingRecord: {
        init() {
            trainingRecordResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "培训记录",
                targetArray: trainingRecordResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/train/trainResult?queryType=1&staffNum=${sn}&pageSize=1000&pageNum=1&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    const list = Array.isArray(data) ? data : [];
                    list.forEach(i => { if (i && i.staffId !== "") i.staffId = staffNum; });
                    return list;
                }
            });
        },
        down(pageSize = 25000) {
            exportMergedBigData(trainingRecordResult, "trainingRecord-培训记录导出", pageSize);
        }
    },

    // ------------------------------
    // 检查记录
    // ------------------------------
    trainingCheckList: {
        init() {
            trainingCheckListResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "检查记录",
                targetArray: trainingCheckListResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/train/trainCheckList?queryType=1&staffNum=${sn}&fleetCd=&qualCd=&trainName=&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    const list = Array.isArray(data) ? data : [];
                    list.forEach(i => { if (i && i.staffId !== "") i.staffId = staffNum; });
                    return list;
                }
            });
        },
        down(pageSize = 8000) {
            exportMergedBigData(trainingCheckListResult, "trainingChecklist-检查记录导出", pageSize);
        }
    },

    // ------------------------------
    // 运行资格
    // ------------------------------
    qualList: {
        arg: { showHistory: true },
        init() {
            qualListResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "运行资格",
                targetArray: qualListResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/qual/qualList?staffNum=${sn}&showHistory=${this.arg.showHistory ? "true" : "false"}&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    const list = Array.isArray(data) ? data : [];
                    list.forEach(i => { if (i) i.staffId = staffNum; });
                    return list;
                }
            });
        },
        down() {
            exportMergedData(qualListResult, "运行资格导出");
        }
    },

    // ------------------------------
    // 技术等级
    // ------------------------------
    skillLevel: {
        init() {
            skillLevelResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "技术等级",
                targetArray: skillLevelResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/qual/skillLevelList?staffNum=${sn}&showHistory=true&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    const list = Array.isArray(data) ? data : [];
                    list.forEach(i => { if (i) i.staffId = staffNum; });
                    return list;
                }
            });
        },
        down() {
            exportMergedData(skillLevelResult, "技术等级导出");
        }
    },

    // ------------------------------
    // 人员信息
    // ------------------------------
    personData: {
        init() {
            personDataResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "人员信息",
                targetArray: personDataResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/basic/cover?staffNum=${sn}&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    if (!data) return [];
                    data.staffId = staffNum;
                    data.mobile = ezIeb.personData.utils.decrypt(data.mobile);
                    data.identityNum = ezIeb.personData.utils.decrypt(data.identityNum);
                    return data;
                }
            });
        },
        down() {
            exportData(personDataResult, "personData-人员信息导出");
        },
        utils: {
            decrypt(e) {
                if (!e) return e;
                try {
                    const t = atob(e);
                    const i = new Uint8Array(t.length);
                    for (let a = 0; a < t.length; a++) {
                        i[a] = t.charCodeAt(a);
                    }
                    const s = [];
                    for (let a = 0; a < i.length; a += 2) {
                        s.push(i[a] << 8 | (255 & i[a + 1]));
                    }
                    return String.fromCharCode(...s.map(v => ~v));
                } catch (error) {
                    console.error("解密失败:", error);
                    return null;
                }
            }
        }
    },

    // ------------------------------
    // 护照签证（已修复：空对象/空数据兜底）
    // ------------------------------
    passport: {
        init() {
            passportResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "护照签证",
                targetArray: passportResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/license/passport?staffNum=${sn}&showHistory=true&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    // ✅ 关键修复：接口可能返回 {} / null / 单对象
                    let list = [];
                    if (Array.isArray(data)) {
                        list = data;
                    } else if (data && typeof data === "object") {
                        // 单对象也包成数组
                        list = [data];
                    }
                    list.forEach(i => { if (i) i.staffId = staffNum; });
                    return list;
                }
            });
        },
        down() {
            exportMergedData(passportResult, "passport-护照签证导出");
        }
    },

    // ------------------------------
    // 飞行时间（按阶段）
    // ------------------------------
    flyTime: {
        viaStage: {
            init() {
                flyTimeViaStageResult = [];
                getCookies();
            },
            getViaStaffNum(staffNum) {
                this.getViaStaffList([staffNum]);
            },
            getViaStaffList(staffList) {
                this.init();
                return ezFetcher.batch({
                    list: staffList,
                    label: "飞行时间(阶段)",
                    targetArray: flyTimeViaStageResult,
                    urlBuilder: sn =>
                        `https://ifly.csair.com/api/profile-app/flyTime/stage?staffNum=${sn}&queryType=1&pageSize=999&pageNum=1&r=${Date.now()}`,
                    processor: (data, staffNum) => {
                        const list = Array.isArray(data) ? data : (data.list || []);
                        list.forEach(i => { if (i) i.staffId = staffNum; });
                        return list;
                    }
                });
            },
            down() {
                exportMergedData(flyTimeViaStageResult, "飞行时间导出-viaStage");
            }
        },

        // ------------------------------
        // 飞行时间（按日期）
        // ------------------------------
        viaDate: {
            init() {
                flyTimeViaDateResult = [];
                getCookies();
            },
            getViaStaffNum(staffArgs) {
                this.getViaStaffList([staffArgs]);
            },
            getViaStaffList(staffList) {
                this.init();
                return ezFetcher.batch({
                    list: staffList,
                    label: "飞行时间(日期)",
                    targetArray: flyTimeViaDateResult,
                    urlBuilder: arr => {
                        var sn = Array.isArray(arr) ? arr[0] : arr;
                        var start = (Array.isArray(arr) && arr[1]) || "2013-01-01";
                        var end = (Array.isArray(arr) && arr[2]) || new Date();
                        return `https://ifly.csair.com/api/profile-app/flyTime/flyTimeByDate?staffNum=${sn}&queryType=3&strTime=${this.utils.getDateDash(start)}&endTime=${this.utils.getDateDash(end)}&r=${Date.now()}`;
                    },
                    processor: (data, staffNum) => {
                        const list = Array.isArray(data) ? data : [data];
                        list.forEach(i => { if (i) i.staffId = staffNum; });
                        return list;
                    }
                });
            },
            down() {
                exportData(flyTimeViaDateResult, "飞行时间导出");
            },
            utils: {
                getDateDash(dt) {
                    var d = new Date(dt);
                    var pad = n => n < 10 ? "0" + n : n;
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                }
            }
        },

        // ------------------------------
        // 飞行时间（汇总）
        // ------------------------------
        total: {
            init() {
                flyTimeTotalResult = [];
                getCookies();
            },
            getViaStaffNum(staffNum) {
                this.getViaStaffList([staffNum]);
            },
            getViaStaffList(staffList) {
                this.init();
                return ezFetcher.batch({
                    list: staffList,
                    label: "飞行时间(汇总)",
                    targetArray: flyTimeTotalResult,
                    urlBuilder: sn =>
                        `https://ifly.csair.com/api/profile-app/basic/cover?staffNum=${sn}&r=${Date.now()}`,
                    processor: (data, staffNum) => {
                        if (!data) return [];
                        var dto = data.flyTimeQueryReturnDTO || data;
                        dto.staffId = staffNum;
                        return dto;
                    }
                });
            },
            down() {
                exportData(flyTimeTotalResult, "飞行时间导出-total");
            }
        },
        // ------------------------------
        // 飞行时间（IEB 按日期段批量查询）
        // 数据格式: [[staffNum, startDate, endDate], ...]
        // ------------------------------
        viaIebDate: {
            init() {
                flyTimeIebDateResult = [];
                getCookies();
            },

            getViaStaffList(dateList) {
                this.init();
                iebFetcher.batch({
                    list: dateList,
                    label: "IEB飞行时间",
                    urlBuilder: ([sn, start, end]) =>
                        `https://ieb.csair.com/newieb/flytime/showFlytimeManyQueryList?` +
                        `staffNum=${sn}` +
                        `&activeStatusArray=ZAIZHI` +
                        `&fleetCdArray1=` +
                        `&fleetCdArray=` +
                        `&chnDescArray=` +
                        `&primaryBaseArray=` +
                        `&baseArray=` +
                        `&dateType=5` +
                        `&exportType=1` +
                        `&startStr=${this.utils.getDateDash(start)}` +
                        `&endStr=${this.utils.getDateDash(end)}` +
                        `&singlefleetCdArray=` +
                        `&chnDescArray1=` +
                        `&page=1` +
                        `&currentStr=${Date.now()}`,

                    processor: (html, [staffNum, startDate, endDate]) => {
                        const $tr = iebFetcher.parseTable(html);
                        if (!$tr) {
                            console.warn(`⚠️ IEB无数据 staff=${staffNum}`);
                            return null;
                        }

                        const tds = $tr.find("td");

                        return {
                            staffId: tds.eq(0).text().trim(),
                            staffName: tds.eq(1).text().trim(),
                            baseReg: tds.eq(2).text().trim(),
                            baseOp: tds.eq(3).text().trim(),
                            currentLevel: tds.eq(4).text().trim(),

                            startDate: tds.eq(5).text().trim(),
                            endDate: tds.eq(6).text().trim(),

                            flyTime: tds.eq(7).text().trim(),
                            expThrTotal: tds.eq(8).text().trim(),
                            legNum: tds.eq(9).text().trim(),

                            nightTime: tds.eq(10).text().trim(),
                            leftThr: tds.eq(11).text().trim(),
                            rightThr: tds.eq(12).text().trim(),

                            simTime: tds.eq(13).text().trim(),
                            localTime: tds.eq(14).text().trim(),

                            totalControl: tds.eq(15).text().trim(),
                            hxControl: tds.eq(16).text().trim(),
                            landLocal: tds.eq(17).text().trim(),

                            manualTime: tds.eq(18).text().trim(),

                            queryStart: startDate,
                            queryEnd: endDate
                        };
                    }
                }).then(res => {
                    flyTimeIebDateResult = res.filter(Boolean);
                    console.log(`✅ IEB飞行时间完成，共 ${flyTimeIebDateResult.length} 条`);
                });
            },

            getViaStaffNum(arr) {
                this.getViaStaffList([arr]);
            },

            utils: {
                getDateDash(dt) {
                    const d = new Date(dt);
                    const pad = n => (n < 10 ? "0" + n : n);
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                }
            },

            down() {
                exportData(flyTimeIebDateResult, "飞行时间导出-iebDate");
            }
        }
},

// ------------------------------
// 航班任务（按航班号）
// ------------------------------
flyTask: {
    viaFlightNum: {
        init() {
            flyTaskViaNumResult = [];
            getCookies();
        },
        getViaFlightNum(flightNum) {
            this.getViaFlightNumList([flightNum]);
        },
        getViaFlightNumList(flightNumList) {
            this.init();
            return ezFetcher.batch({
                list: flightNumList,
                label: "航班任务",
                targetArray: flyTaskViaNumResult,
                urlBuilder: fn =>
                    `https://ifly.csair.com/api/os-app/flightTask/page?pageNum=1&pageSize=9999&fltNum=${fn}&depCd=&arvCd=&startDate=20260217&endDate=20260226&r=${Date.now()}`,
                processor: (data, fltNum) => {
                    const list = (data && data.list) || [];
                    list.forEach(i => { if (i) i.fltNum = fltNum; });
                    return list;
                }
            });
        },
        down() {
            exportMergedData(flyTaskViaNumResult, "航班任务导出");
        }
    },

        // ------------------------------
        // 航班任务（按详情）
        // ------------------------------
        viaDetail: {
            init() {
                flyDetailResult = [];
                getCookies();
            },
            getViaFlightInfo(flightInfo) {
                this.getViaFlightList([flightInfo]);
            },
            getViaFlightList(flightInfoList) {
                this.init();
                return ezFetcher.batch({
                    list: flightInfoList,
                    label: "航班机组成员",
                    targetArray: flyDetailResult,
                    urlBuilder: info => {
                        var fn = info[0], dt = info[1], dep = info[2], arv = info[3];
                        return `https://ifly.csair.com/api/os-app/mobile/work/taskQuery/task/his/flightCrew?fltNum=${fn}&depCd=${dep}&arvCd=${arv}&startDate=${dt}&endDate=${dt}&fleetCd=773&r=${Date.now()}`;
                    },
                    processor: (data, flightInfo) => {
                        const list = Array.isArray(data) ? data : [];
                        var fn = flightInfo[0], dt = flightInfo[1], dep = flightInfo[2], arv = flightInfo[3];
                        list.forEach(i => {
                            if (!i) return;
                            i.fltNum = fn;
                            i.date = dt;
                            i.depCd = dep;
                            i.arvCd = arv;
                        });
                        return list;
                    }
                });
            },
            down() {
                exportMergedData(flyDetailResult, "航班任务机组成员导出");
            }
        }
    },
    
    // ------------------------------
    // 体检合格证记录
    // ------------------------------
    medicalCert: {
        init() {
            medicalCertResult = [];
            getCookies();
        },
        getViaStaffNum(staffNum) {
            this.getViaStaffList([staffNum]);
        },
        getViaStaffList(staffList) {
            this.init();
            return ezFetcher.batch({
                list: staffList,
                label: "体检合格证记录",
                targetArray: medicalCertResult,
                urlBuilder: sn =>
                    `https://ifly.csair.com/api/profile-app/health/checkMedicalList?staffNum=${sn}&r=${Date.now()}`,
                processor: (data, staffNum) => {
                    const list = Array.isArray(data) ? data : [];
                    list.forEach(i => { if (i && i.staffId !== "") i.staffId = staffNum; });
                    return list;
                }
            });
        },
        down() {
            exportMergedData(medicalCertResult, "medicalCert-体检合格证导出");
        }
    },

    // ------------------------------
    // 自动化批量执行
    // ------------------------------
    auto: {
        async get(staffList) {
            staffList = staffList || staffJSZB;
            if (!staffList || staffList.length === 0) {
                alert("staffList 未定义或为空！");
                return;
            }

            ezFetcher.concurrency = 4;
            console.log(`🚀 ezIeb 开始批量拉取，共 ${staffList.length} 人`);

            await ezIeb.trainingRecord.getViaStaffList(staffList);
            console.log(`✅ 培训记录: ${trainingRecordResult.length} 条`);

            await ezIeb.trainingCheckList.getViaStaffList(staffList);
            console.log(`✅ 检查记录: ${trainingCheckListResult.length} 条`);

            await ezIeb.qualList.getViaStaffList(staffList);
            console.log(`✅ 运行资格: ${qualListResult.length} 条`);

            await ezIeb.skillLevel.getViaStaffList(staffList);
            console.log(`✅ 技术等级: ${skillLevelResult.length} 条`);

            await ezIeb.personData.getViaStaffList(staffList);
            console.log(`✅ 人员信息: ${personDataResult.length} 条`);

            await ezIeb.passport.getViaStaffList(staffList);
            console.log(`✅ 护照签证: ${passportResult.length} 条`);

            await ezIeb.flyTime.viaStage.getViaStaffList(staffList);
            console.log(`✅ 飞行时间(阶段): ${flyTimeViaStageResult.length} 条`);

            await ezIeb.flyTime.total.getViaStaffList(staffList);
            console.log(`✅ 飞行时间(汇总): ${flyTimeTotalResult.length} 条`);

            console.log("🎉 全部数据拉取完成！调用 ezIeb.auto.down() 导出 Excel");
        },
        down() {
            console.log("📦 开始导出所有模块...");
            console.log(`  培训记录: ${trainingRecordResult.length} 条`);
            console.log(`  检查记录: ${trainingCheckListResult.length} 条`);
            console.log(`  运行资格: ${qualListResult.length} 条`);
            console.log(`  技术等级: ${skillLevelResult.length} 条`);
            console.log(`  人员信息: ${personDataResult.length} 条`);
            console.log(`  护照签证: ${passportResult.length} 条`);
            console.log(`  飞行时间(阶段): ${flyTimeViaStageResult.length} 条`);
            console.log(`  飞行时间(汇总): ${flyTimeTotalResult.length} 条`);

            ezIeb.trainingRecord.down();
            ezIeb.trainingCheckList.down();
            ezIeb.qualList.down();
            ezIeb.skillLevel.down();
            ezIeb.personData.down();
            ezIeb.passport.down();
            ezIeb.flyTime.viaStage.down();
            ezIeb.flyTime.total.down();

            console.log("📥 全部导出完成！");
        }
    },

    // ------------------------------
    // UI 入口
    // ------------------------------
    UI: {
        init() {
            const dom = document.createElement("div");
            dom.innerHTML = `<a class="admin-link font-16 el-link el-link--default">
            <span class="el-link--inner">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAAXNSR0IB2cksfwAAARRQTFRFAAAA////QID/Nnb/XJ7/SYn/U5T/Q4P/S4z/VZf/PXz/To//Pn7/WZv/O3r/Rob/NHP/UJL/V5j/OXj/UoT/XqH/YaP/8vf/Wpz/MnH/W5n/P37/SYj/RYP/MG//UZD/WZn/Ypr/f6r/i7b/hK7/U4z/OXP/ZZ3/+Pv/WJn/X5f/YaX/WZn/Sor/S4v/SYb/V5H/XZX/YqT/L27/QGD/wtj/krj/QoP/Pn7/YqT/PXz/Lmz/RYb/S43/QYL/MG//UZP/PXr/TI3/R4j/2+j/U5b/Q4T/LW3/L2z/QID/qMr/T4//YKP/LW//L2v/QIb/zNz/YqT/T4//L2//Onr/L2//P3//ocL/Pn3/P3//OXX/QHv/8vfFewAAAFx0Uk5TAP////////////////////////8Q//////9AgICA/4CA/////yAg/////99wYHBA//9w3wj//zBwUGhAv5/f73B8r9//v48wrxj/z0iPvyj/n++fgM/v/9+/SDjKjaDfAAAB70lEQVR4nLXTWVvaQBQG4BGILEkAJcRAEk1aAwiCFFHc92q1q3av//9/dObMnOSYJ7Te+F3OvM83c4bA2Etl6/rkh2EYlUq12mg08vl6vd46/f71MMWio1qxmMvlUOalbK2uvutQN7uscZgtt29I36WmZcoWyKTzQhNwbueneI5SSdPmdILEiY5LIGtQmiU/Kvhej2V257aCD/oTySmHVJ4quKQr+bPXW6FZ+FKVEiHKq4VUeprsVHAR5Xh3HfJKZX2sTkcYy3kTEfhvqWB58X+dCGPZ7YZh2O+/4RlTqeAyyh068W4xkQpugOT3zIBSKmguY2e3C4fz0/tjek+EJodlnF1/MpEBv6aCjpl00tlPrt1997dBoIOdVB5tyd2OW6koWHBUZ/haJuTS4xvTjgX0F8JCQUr8KFbKJeFm5+63PyAJBHknv7Lejn4s1n3Xdc/pv7XJZcE0N8hEEV+2PCFvKGw249OlvID1oe+7exaBNkAqh7A+9Xz/kTg2sLFSySX5MjPP84cU3tukE95TXJFZozUuPxO4b6dlm7WDYI3HEwMdkLOVxJcfsv0AJId8oBi2bZBNeCUh37IPQSKTRjax49Ple0bMSjKl1xxgpyMOWwZ0FtwAAAAAElFTkSuQmCC" alt="logo" class="logo home-logo">
            <span>EZ Platform</span>
            </span></a>`;
            dom.style.cursor = "pointer";
            dom.onclick = () => {
                document.querySelector("#mainContent").innerHTML = getCookies().IFLY_TOKEN;
            };
            document.querySelector(".portal-header__body-right").appendChild(dom);
            console.log(`ezIeb CommandLine Tool Version:${versionID}`);
        }
    }
};

// ==============================
// ✅ Console 辅助
// ==============================
var ezConsole = {
    init() {
        document.querySelector("#mainContent").innerHTML = ``;
    },
    log(...text) {
        const pDom = document.createElement("p");
        pDom.innerText = text.join(" ");
        console.log(text);
        document.querySelector("#mainContent").appendChild(pDom);
    }
};

// ==============================
// ✅ SheetJS 加载器
// ==============================
function loadSheetJS() {
    return new Promise((resolve, reject) => {
        if (typeof XLSX !== "undefined") {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
        script.onload = () => {
            if (typeof make_xlsx_lib === "function") {
                make_xlsx_lib(XLSX);
            }
            resolve();
        };
        script.onerror = () => {
            console.error("❌ SheetJS 加载失败，请检查网络");
            reject(new Error("SheetJS load failed"));
        };
        document.head.appendChild(script);
    });
}

// ==============================
// ✅ jQuery 加载器
// ==============================
function loadJqueryJS() {
    return new Promise((resolve, reject) => {
        if (typeof jQuery !== "undefined") {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==============================
// ✅ 数据预处理（对象转字符串）
// ==============================
function preprocessData(data) {
    return data.map(item => {
        if (!item || typeof item !== "object") return item;
        const processed = {};
        for (const key in item) {
            const value = item[key];
            processed[key] = (typeof value === "object" && value !== null)
                ? JSON.stringify(value)
                : value;
        }
        return processed;
    });
}

// ==============================
// ✅ 合并数组到 Workbook（已修复：不再双重嵌套）
// ==============================
function mergeArraysToWorkbook(arrays) {
    // ✅ 关键修复：arrays 本身就是扁平数据数组，不要再把每个元素当子数组 concat
    const mergedData = arrays
        .filter(item => item && typeof item === "object")
        .map(data => preprocessData([data])[0]);

    if (mergedData.length === 0) {
        console.warn("⚠️ 没有有效数据可导出（数组为空）");
        // 返回一个空 workbook 而不是崩溃
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([{ 提示: "无数据" }]);
        XLSX.utils.book_append_sheet(wb, ws, "无数据");
        return wb;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mergedData);
    XLSX.utils.book_append_sheet(wb, ws, "合并数据");
    return wb;
}

function arraysToWorkbook(arrays) {
    const mergedData = arrays
        .filter(item => item && typeof item === "object")
        .map(data => preprocessData([data])[0]);

    if (mergedData.length === 0) {
        console.warn("⚠️ 没有有效数据可导出（数组为空）");
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([{ 提示: "无数据" }]);
        XLSX.utils.book_append_sheet(wb, ws, "无数据");
        return wb;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(mergedData);
    XLSX.utils.book_append_sheet(wb, ws, "数据");
    return wb;
}

// ==============================
// ✅ 下载 Excel
// ==============================
function downloadExcel(workbook, filename) {
    if (!workbook) {
        console.error("❌ workbook 为空，无法下载");
        return;
    }
    XLSX.writeFile(workbook, filename);
    console.log(`📥 文件已下载: ${filename}`);
}

function getNowDash() {
    var now = new Date();
    var pad = n => n < 10 ? "0" + n : n;
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

// ==============================
// ✅ 导出流程（已修复：确认数据非空再导出）
// ==============================
async function exportData(arrays, filename) {
    try {
        if (!arrays || arrays.length === 0) {
            console.warn(`⚠️ [${filename}] 数据为空，跳过导出`);
            return;
        }
        await loadSheetJS();
        const workbook = arraysToWorkbook(arrays);
        downloadExcel(workbook, `${filename}-${getNowDash()}.xlsx`);
    } catch (error) {
        console.error("导出失败:", error);
    }
}

async function exportMergedData(arrays, filename) {
    try {
        if (!arrays || arrays.length === 0) {
            console.warn(`⚠️ [${filename}] 数据为空，跳过导出`);
            return;
        }
        await loadSheetJS();
        const workbook = mergeArraysToWorkbook(arrays);
        downloadExcel(workbook, `${filename}-${getNowDash()}.xlsx`);
    } catch (error) {
        console.error("导出失败:", error);
    }
}

// ✅ 已修复：分页逻辑 + 空数据检查
async function exportMergedBigData(arrays, filename, pageSize = 100) {
    try {
        if (!arrays || arrays.length === 0) {
            console.warn(`⚠️ [${filename}] 数据为空，跳过导出`);
            return;
        }

        await loadSheetJS();
        var totalPages = Math.ceil(arrays.length / pageSize);

        for (var pgNum = 0; pgNum < totalPages; pgNum++) {
            var start = pgNum * pageSize;
            var end = start + pageSize;
            var chunk = arrays.slice(start, end);

            console.log(`📦 导出分片 ${pgNum + 1}/${totalPages} (${chunk.length} 条)`);

            var workbook = mergeArraysToWorkbook(chunk);
            downloadExcel(workbook, `${filename}-序号-${pgNum + 1}-${getNowDash()}.xlsx`);
        }
    } catch (error) {
        console.error("导出失败:", error);
    }
}
// ==============================
// ✅ PowerToys: GET Training Record --> Console
// ==============================
function getTrainList(){
    const rows = [...document.querySelectorAll('.bDiv tbody.list tr')];

    const tsv = rows.map(tr => {
      const cells = [...tr.querySelectorAll('td')];
      // 取第 2~5 列：索引 1~4
      return [
        cells[1].innerText.trim(), // 文章编号
        cells[2].innerText.trim(), // 文章标题
        cells[3].innerText.trim(), // 发布人
        cells[4].innerText.trim()  // 发布日期
      ].join('\t');
    }).join('\n');
    
    console.log(tsv)
}

// ==============================
// ✅ 获取 Cookies / Token
// ==============================
function getCookies() {
    var cookiesArr = document.cookie.split("; ");
    var result = {};
    cookiesArr.forEach(function (cookie) {
        var parts = cookie.split("=");
        var key = decodeURIComponent(parts[0]);
        var value = decodeURIComponent(parts[1] || "");
        result[key] = value;
    });
    IFLY_TOKEN = result.IFLY_TOKEN || "";
    cookies = result;
    return result;
}

// ==============================
// ✅ 启动
// ==============================
window.onload = () => {
    setTimeout(() => ezIeb.UI.init(), 4000);
};

console.log(`%c🚀 ezIeb CLI v${versionID} 已加载\n调用方式:\n  ezIeb.auto.get(staffJSZB)  // 批量拉取\n  ezIeb.auto.down()        // 导出 Excel`, "color:#2196f3;font-weight:bold;font-size:13px");
