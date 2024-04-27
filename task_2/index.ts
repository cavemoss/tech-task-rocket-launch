import { tests } from "./tests.js" 

type Store = Array<{
    size: number
    quantity: number
}>

type Order = Array<{
    id: number
    size: [number, number] | [number]
    masterSize?: "s1" | "s2"
}>

type Result = {
    stats: Array<{ size: number, quantity: number }>
    assignment: Array<{ id: number, size: number }>
    mismatches: number
}

function process(store: Store, order: Order): false | Result {
    type NewOrder = { id: number, size: number }

    let result: Result = {
        stats: [],
        assignment: [],
        mismatches: 0
    }

    for(let option of store) result.stats.push({size: option.size, quantity: 0})

    const index = (ms:string) => Number(ms.slice(1)) - 1

    const assign = (order:NewOrder, masterSize?:number): void => {
        result.assignment.push(order)
        if(masterSize) if(order.size != masterSize) result.mismatches ++
        for(let stat of result.stats) {
            if(stat.size == order.size) stat.quantity ++
        }
    }

    for(let oneOrder of order) {
        for(let option of store) {
            const newOrder: NewOrder = {id: oneOrder.id, size: option.size} 

            if(oneOrder.masterSize) {
                const masterSize = oneOrder.size[index(oneOrder.masterSize)]
                
                // if there is a specified master size
                if(masterSize == option.size && option.quantity > 0) {
                    assign(newOrder, masterSize)
                    option.quantity --
                    break
                }
                    
                else {
  
                    // iterate through other choices
                    for(let size of oneOrder.size) {
                        if(size == option.size && option.quantity > 0) {
                            assign(newOrder, masterSize)
                            option.quantity --
                            break
                        }
                    }
                }
            } 

            // there is only one choice
            else if(oneOrder.size[0] == option.size && option.quantity > 0) {
                assign(newOrder) 
                option.quantity --
                break
            }
        }

    }

    return (result.assignment.length == 0)? false : result
}

for(let test of tests) console.log(process(test.store, test.order))

