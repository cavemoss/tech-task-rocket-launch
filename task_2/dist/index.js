import { tests } from "./tests.js";
function process(store, order) {
    let result = {
        stats: [],
        assignment: [],
        mismatches: 0
    };
    for (let option of store)
        result.stats.push({ size: option.size, quantity: 0 });
    const index = (ms) => Number(ms.slice(1)) - 1;
    const assign = (order, masterSize) => {
        result.assignment.push(order);
        if (masterSize)
            if (order.size != masterSize)
                result.mismatches++;
        for (let stat of result.stats) {
            if (stat.size == order.size)
                stat.quantity++;
        }
    };
    for (let oneOrder of order) {
        for (let option of store) {
            const newOrder = { id: oneOrder.id, size: option.size };
            if (oneOrder.masterSize) {
                const masterSize = oneOrder.size[index(oneOrder.masterSize)];
                if (masterSize == option.size && option.quantity > 0) {
                    assign(newOrder, masterSize);
                    option.quantity--;
                    break;
                }
                else {
                    for (let size of oneOrder.size) {
                        if (size == option.size && option.quantity > 0) {
                            assign(newOrder, masterSize);
                            option.quantity--;
                            break;
                        }
                    }
                }
            }
            else if (oneOrder.size[0] == option.size && option.quantity > 0) {
                assign(newOrder);
                option.quantity--;
                break;
            }
        }
    }
    return (result.assignment.length == 0) ? false : result;
}
for (let test of tests)
    console.log(process(test.store, test.order));
