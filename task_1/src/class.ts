type Row = {
    id: number,
    cid: number,
    type: string,
    date: string
}

type Result = {
    start: string,
    end: string
    count: number
}

export class Process { 

    static list: Process[] = []
    static range: number = 0
    static date: string[] = []

    public cid: number | undefined
    public runtime: [number, number] | undefined

    constructor (data:Row[], cid:number) {

        Process.list.filter(obj => obj.cid == cid)
        Process.range = data.length
        data.forEach(row => Process.date.push(row.date))

        if(Process.list.filter(obj => obj.cid == cid).length == 0) {
            let range = data.filter(obj => obj.cid == cid)
            this.cid = cid
            this.runtime = [data.indexOf(range[0]), data.indexOf(range[1])]
            Process.list.push(this) 
        } 
    }

    static reset = () => {
        Process.list = []
        Process.range = 0
    }

    static parse = function() {
        let concurrency: Array<{concurrent: number, date: string}> = []
        for (let i = 0; i < Process.range; i++) {
            let line = ''
            let concurrent = 0
            
            Process.list.forEach(process => {
                if(process.runtime) if(process.runtime[0] <= i && process.runtime[1] >= i) {
                    line += String(`[${process.cid}]`)
                    concurrent ++
                }
            })
            concurrency.push({concurrent: concurrent, date: new Date(Process.date[i]).toLocaleString()})
            //console.log(line)
        }
        Process.reset()
        return concurrency
    }

    static returnRange = function(parsed:Array<{concurrent: number, date: string}>, start:number, end:number): Result {
        return {start: parsed[start].date, end: parsed[end].date, count: parsed[start].concurrent}
    }
}