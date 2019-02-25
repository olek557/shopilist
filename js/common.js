'use strict'

const API_URL = 'http://68.183.12.15:3000/shop_lists',
      ORIGIN_URL = window.location.origin;
let currentList,
    allLists;

function List(uuid, title) {
  this.constructor(uuid, title);
}

List.prototype = {
  listItems: {},
  constructor: function(uuid, title) {
    if(uuid) {
      this.getList(uuid);
    }
    else {
      this.generateList(title);
    }
  },
  getList: function(uuid) {
    const link = API_URL + '/' + uuid;
    fetch(link, {mode: 'cors'})
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
       })
      .then((list) => {
        this.restructurisingListObject(list);
        this.insertList();
      })
      .catch((error) => {
        console.log(error);
      }
    );
  },
  generateList: function(title) {
    let listTitle = {'title': title};
    fetch(API_URL, {
      method: "POST", 
      body: JSON.stringify(listTitle),
      headers: new Headers({'content-type': 'application/json'})
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then(list => {
      this.restructurisingListObject(list);
      let lists = JSON.parse(localStorage.getItem('shopilist_userLists'));
      console.log(lists);
      lists.listsUUID.push(list.uuid);
      localStorage.setItem('shopilist_userLists', JSON.stringify(lists));
      window.location.href = ORIGIN_URL + '/#list:'+ list.uuid;
    })
    .catch(error => {
      console.log(error);
    });
  },
  restructurisingListObject: function(listObject) {
    this.title = listObject.title;
    this.createAt = listObject.created_at;
    this.updateAt = listObject.updated_at;
    this.title = listObject.title;
    this.id = listObject.id;
    this.uuid = listObject.uuid;
    this.list = listObject.items;
    this.listFullObj= listObject;
  },
  insertList: function() {
    let listWrapper = document.getElementById('list-wrapper');
    if(this.title) {
      document.getElementById('list-name').innerHTML = this.title;
    }
    this.list.forEach((listItem) => {
      listWrapper.append(generateNewItem(listItem));
    });
  },
  addNewItem: function(name, status) {
    let listWrapper = document.getElementById('list-wrapper'),
        listItem = {'name': name, 'status': status};
    fetch(API_URL + '/' + currentList.uuid + '/items', {
      method: "POST", 
      body: JSON.stringify(listItem),
      headers: new Headers({'content-type': 'application/json'})
    }).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then(function(item) {
      listWrapper.append(generateNewItem(item));
    })
    .catch(error => {
      console.log(error);
    });
  },
  updateListItem: function(name, status, id) {
    let listItem = {'name': name, 'status': status};
    fetch(API_URL + '/' + currentList.uuid + '/items/' + id, {
      method: "PUT", 
      body: JSON.stringify(listItem),
      headers: new Headers({'content-type': 'application/json'})
    });
  }
}

document.body.addEventListener("click", ({target}) => {
  if(target == document.getElementById("new-item-btn")) {
    let addNewInput = document.getElementById("new-item-input"),
        listWrapper = document.getElementById("list-wrapper");
    if(addNewInput.value) {
      currentList.addNewItem(addNewInput.value, false);
    }
    addNewInput.value = '';
  }
});

document.body.addEventListener("click", ({target}) => {
  if(target == document.getElementById("generate-list")) {
    let newListTitle = document.getElementById("new-list-title").value;
    if(newListTitle) {
      currentList = new List(false, newListTitle);
    }
    newListTitle = '';
  }
});

document.body.addEventListener("change", (event) => {
  let target = event.target.closest('.checkbox')
  if(target) {
    let id = target.id,
        name = target.querySelector('.checkbox__label').innerText,
        status = target.querySelector('input').checked;
    currentList.updateListItem(name, status, id);
  }
});

function generateNewItem({name, status, id}) {
  let li = document.createElement('li'),
      wrapper = document.createElement('label'),
      input = document.createElement('input'),
      label = document.createElement('span');
  label.classList.add('checkbox__label');
  label.innerHTML = name;
  input.setAttribute('type', 'checkbox');
  input.checked = status;
  wrapper.classList.add('checkbox');
  wrapper.append(input, label);
  wrapper.setAttribute('id', id);
  li.classList.add('list__item');
  li.append(wrapper);
  return li;
}

function getAllUserLists() {
  let userListUUID = JSON.parse(localStorage.getItem('shopilist_userLists')).listsUUID;
  if(userListUUID) {
    console.log(userListUUID);
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        console.log('here');
        insertLists(userListUUID);
        clearInterval(stateCheck);
        // document ready
      }
    }, 100);
  }
  else {
    let lists = {
      listsUUID: []
    };
    localStorage.setItem('shopilist_userLists', JSON.stringify(lists));
  }
  // const link = API_URL;
  // fetch(link, {mode: 'cors'})
  //   .then(function(response) {
  //     if (!response.ok) {
  //       throw Error(response.statusText);
  //     }
  //     return response.json();
  //    })
  //   .then((lists) => {
  //     allLists = lists;
  //     insertLists(lists);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   }
  // );

}

function insertLists(listsID) {

  let listsWrapper = document.getElementById('lists-wrapper');
  let ul = document.createElement('ul');
  ul.classList.add('list', 'list--links');
  ul.setAttribute('id', 'lists-element');
  listsWrapper.append(ul);
  
  listsID.forEach(listId => {
    insertListItem(listId);
  });

}

function insertListItem(listId) {
  const link = API_URL + '/' + listId;
  fetch(link, {mode: 'cors'})
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
     })
    .then((list) => {
      let listsElement = document.getElementById('lists-element');
      let li = document.createElement('li'),
      link = document.createElement('a'),
      linkAdditional = document.createElement('span');
      li.classList.add('list__item');
      link.classList.add('link');
      linkAdditional.classList.add('link__additional');
      link.innerHTML = list.title;
      link.setAttribute('href', '/#list:' + list.uuid);

      linkAdditional.innerHTML = '(' +(new Date(list.created_at)).toLocaleDateString() + ')';
      li.append(link, linkAdditional);
      listsElement.append(li);
    })
    .catch((error) => {
      console.log(error);
    }
  );

}


let router = new Router([
  new Route('home', 'home.html', true),
  new Route('list', 'list.html')
]);

document.body.addEventListener("click", ({target}) => {
  if(target == document.querySelector('.copy-link-btn')) {
    var dummy = document.createElement('input'),
        text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }
});
