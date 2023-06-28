# HTMLTemplateElement and DocumentFragment

Using a document fragment to create and modify elements before appending them to the DOM can be more performant compared to directly manipulating the DOM. Here's why:

1. **Reduced Layout Recalculations and Repaints:** When you modify the DOM directly, each change triggers layout recalculations and repaints, which can be expensive operations. By using a document fragment, you can make multiple changes to elements offline (without being attached to the DOM), reducing the number of layout recalculations and repaints required.

2. **Efficient Batch Updates:** With a document fragment, you can batch multiple changes together before appending them to the DOM. This minimizes the number of interactions with the live DOM, leading to improved performance. It's especially beneficial when you need to make several changes to different elements simultaneously.

3. **Minimized Reflow:** When you modify the DOM directly, each change may trigger reflow, where the browser calculates the positions and dimensions of elements. By using a document fragment, you can avoid unnecessary reflows until you are ready to append the modified elements to the DOM.

4. **Lightweight Document Manipulation:** Document fragments are lightweight and don't require the overhead of attaching and detaching elements to the live DOM. This can result in improved performance, especially when dealing with a large number of elements or frequent updates.

**Q:** Which one is more performant and dynamic, when we need multiple sets of changes?

1. Modify `HTMLTemplateElement` when changes happen, then clone it
2. Colne `HTMLTemplateElement` "once", and apply changes on `DocumentFragment`

```js
const iterations = 10000; // Number of iterations for the test

// Approach 1: Directly modify HTMLTemplateElement and clone
function approach1() {
  const template = document.createElement('template');
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Original content';
  template.content.appendChild(paragraph);

  for (let i = 0; i < iterations; i++) {
    const clonedTemplate = template.cloneNode(true);
    const clonedParagraph = clonedTemplate.content.querySelector('p');
    clonedParagraph.textContent = `Modified content ${i}`;
  }
}

// Approach 2: Clone HTMLTemplateElement once and apply changes on DocumentFragment
function approach2() {
  const template = document.createElement('template');
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Original content';
  template.content.appendChild(paragraph);

  const fragment = document.createDocumentFragment();
  const clonedTemplate = template.cloneNode(true);
  const clonedParagraph = clonedTemplate.content.querySelector('p');
  fragment.appendChild(clonedTemplate);

  for (let i = 0; i < iterations; i++) {
    clonedParagraph.textContent = `Modified content ${i}`;
  }
}

// Measure the execution time for Approach 1
console.time('Approach 1');
approach1();
console.timeEnd('Approach 1');

// Measure the execution time for Approach 2
console.time('Approach 2');
approach2();
console.timeEnd('Approach 2');

// VM84:37 Approach 1: 6.400634765625 ms
// VM84:42 Approach 2: 1.72998046875 ms

// VM94:37 Approach 1: 14.6201171875 ms
// VM94:42 Approach 2: 7.0048828125 ms

// VM98:37 Approach 1: 25.605712890625 ms
// VM98:42 Approach 2: 7.94091796875 ms

// VM102:37 Approach 1: 17.23828125 ms
// VM102:42 Approach 2: 3.81396484375 ms
```
