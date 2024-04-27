"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
class Process {
    constructor(data, cid) {
        Process.list.filter(obj => obj.cid == cid);
        Process.range = data.length;
        data.forEach(row => Process.date.push(row.date));
        if (Process.list.filter(obj => obj.cid == cid).length == 0) {
            let range = data.filter(obj => obj.cid == cid);
            this.cid = cid;
            this.runtime = [data.indexOf(range[0]), data.indexOf(range[1])];
            Process.list.push(this);
        }
    }
}
exports.Process = Process;
Process.list = [];
Process.range = 0;
Process.date = [];
Process.reset = () => {
    Process.list = [];
    Process.range = 0;
};
Process.parse = function () {
    let concurrency = [];
    for (let i = 0; i < Process.range; i++) {
        let line = '';
        let concurrent = 0;
        Process.list.forEach(process => {
            if (process.runtime)
                if (process.runtime[0] <= i && process.runtime[1] >= i) {
                    line += String(`[${process.cid}]`);
                    concurrent++;
                }
        });
        concurrency.push({ concurrent: concurrent, date: new Date(Process.date[i]).toLocaleString() });
        //console.log(line)
    }
    Process.reset();
    return concurrency;
};
Process.returnRange = function (parsed, start, end) {
    return { start: parsed[start].date, end: parsed[end].date, count: parsed[start].concurrent };
};
