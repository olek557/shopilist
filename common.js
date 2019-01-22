let addNewInput = document.getElementById("new-item-input"),
    addNewBtn = document.getElementById("new-item-btn"),
    listWrapper = document.getElementById("list-wrapper");


addNewBtn.addEventListener("click", () => {
  if(addNewInput.value) {
    listWrapper.append(generateNewItem(addNewInput.value));
  }
  addNewInput.value = '';
});


function generateNewItem(name) {
  let li = document.createElement('li'),
      wrapper = document.createElement('label'),
      input = document.createElement('input'),
      label = document.createElement('span');
  label.classList.add('checkbox__label');
  label.innerHTML = name;
  input.setAttribute('type', 'checkbox');
  wrapper.classList.add('checkbox');
  wrapper.append(input, label);
  li.classList.add('list__item');
  li.append(wrapper);
  return li;
}
