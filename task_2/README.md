/*
У нас есть склад, на котором лежат тканевые маски разных размеров.
```ts
type Store = Array<{
  size: number
  quantity: number
}>
```

На склад приходит заказ, который содержит id покупателей и один или два размера тканевой маски,
которые ему подходят. Причем второй размер, если он есть, на единицу больше первого.
Если покупателю подходят 2 размера, то он дополнительно указывает приоритетный размер (masterSize),
который он хотел бы получить, s1, если приоритетным размером является первый и s2, если второй.
```ts
type Order = Array<{
  id: number
  size: [number]
} | {
  id: number
  size: [number, number]
  masterSize: "s1" | "s2"
}>
```

Необходимо написать функцию process, которая первым аргументом принимает sore: Store, вторым - order: Order
и возвращает:
- false, если склад не сможет обработать данный заказ (например, на складе нет подходящих размеров);
- объект Result, если заказ можно обработать, выдав всем подходящий размер.
```ts
type Result = {
  stats: Array<{ size: number, quantity: number }>
  assignment: Array<{ id: number, size: number }>
  mismatches: number
}
```
где stats - отсортированный по возрастанию размеров массив, содержащий информацию о выданных размерах и их кол-ве;
assignment - массив, содержащий сведения о том, кто какой размер получил
mismatches - кол-во покупателей, у которых выданный размер НЕ совпал с приоритетным.

В переменной tests указаны некоторые тесты, на которых будет проверятся решение.
Большим плюсом будет реализация задания на TS
В случае реализации задания на TS вместе с .ts файлом приложить также .js файл
*/

```js
const process = (store, order) => {
    // Код писать только здесь
    // Не менять сигнатуру данной функции
}


const tests = [
    {
        store: [{ size: 2, quantity: 1 }],
        order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
        isPossible: true,
        mismatches: 1,
    },
    {
        store: [{ size: 3, quantity: 1 }],
        order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
        isPossible: false,
        mismatches: 0,
    },
    {
        store: [{ size: 2, quantity: 4 }],
        order: [
            { id: 101, size: [2] },
            { id: 102, size: [1, 2], masterSize: "s2" },
        ],
        isPossible: true,
        mismatches: 0,
    },
    {
        store: [
            { size: 1, quantity: 1 },
            { size: 2, quantity: 2 },
            { size: 3, quantity: 1 },
        ],
        order: [
            { id: 100, size: [1] },
            { id: 101, size: [2] },
            { id: 102, size: [2, 3], masterSize: "s1" },
            { id: 103, size: [1, 2], masterSize: "s2" },
        ],
        isPossible: true,
        mismatches: 1,
    }
];
