'use strict'

// const API_URL = 'http://68.183.12.15:3000/shop_lists',
const API_URL = 'http://127.0.0.1:3000',
      ORIGIN_URL = window.location.origin;
let currentList,
    allLists;

function List(id, title) {
  this.constructor(id, title);
}

List.prototype = {
  listItems: {},
  constructor: function(id, title) {
    if(id) {
      this.getList(id);
    }
    else {
      this.generateList(title);
    }
  },
  getList: function(id) {
    const link = API_URL + '/shop_lists' + '/' + id,
          token = getCookie('yourList.token')[0].split('=')[1];

    fetch(link, {
      mode: 'cors',
      headers: new Headers({
          'content-type': 'application/json',
          'authorization': token
      })
    })
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
    let listTitle = {'title': title},
        token = getCookie('yourList.token')[0].split('=')[1];
    fetch(API_URL + '/shop_lists', {
      method: "POST", 
      body: JSON.stringify(listTitle),
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': token
      })
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then(list => {
      this.restructurisingListObject(list);
      window.location.href = ORIGIN_URL + '/#list:'+ list.id;
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
        listItem = {'name': name, 'status': status},
        token = getCookie('yourList.token')[0].split('=')[1];
    fetch(API_URL + '/shop_lists' + '/' + currentList.id + '/items', {
      method: "POST", 
      body: JSON.stringify(listItem),
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': token
      })
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
    let listItem = {'name': name, 'status': status},
        token = getCookie('yourList.token')[0].split('=')[1];
    fetch(API_URL + '/shop_lists' + '/' + currentList.id + '/items/' + id, {
      method: "PUT", 
      body: JSON.stringify(listItem),
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': token
      })
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
  const link = API_URL + '/shop_lists',
        token = getCookie('yourList.token')[0].split('=')[1];

  fetch(link, {
    mode: 'cors',
    headers: new Headers({
        'content-type': 'application/json',
        'authorization': token
    })
  })
    .then(function(response) {
      if (!response.ok) {
        if (response.statusText == 'Unauthorized') {
          window.location.href = ORIGIN_URL + '/#sign_in';
          return false;
        }
        throw Error(response.statusText);
      }
      return response.json();
     })
    .then((lists) => {
      allLists = lists;
      if(lists.length > 0) {
        insertLists(lists);
      }
    })
    .catch((error) => {
      console.log(error);
    }
  );
}

function insertLists(lists) {
  let listsWrapper = document.getElementById('lists-wrapper'),
      ul = document.createElement('ul');
      ul.classList.add('list', 'list--links');
  if(lists) {
    lists.forEach(list => {
      let li = document.createElement('li'),
          link = document.createElement('a'),
          linkAdditional = document.createElement('span');
      li.classList.add('list__item');
      link.classList.add('link');
      linkAdditional.classList.add('link__additional');
      link.innerHTML = list.title;
      link.setAttribute('href', '/#list:' + list.id);

      linkAdditional.innerHTML = '(' +(new Date(list.created_at)).toLocaleDateString() + ')';
      li.append(link, linkAdditional);
      ul.append(li);
    });
    listsWrapper.append(ul);
  }
}

function setCookie(cookieObj, name) {
  document.cookie = name + '=' + cookieObj.token + '; path=/; expires=' + cookieObj.exp;
}

function getCookie(name) {
  return document.cookie.split(';').filter(cookie_item => { return cookie_item.match(name) });
}

function registerUser() {
  let email = document.getElementById('email-input').value,
      userName = document.getElementById('username-input').value,
      pass = document.getElementById('password-input').value,
      repass = document.getElementById('repassword-input'),
      userData = { "username": userName, "email": email, "password": pass, "password_confirmation": repass.value };
      console.log(userData);
  if(pass != repass.value) {
    repass.classList.add('error');
    return false;
  }
  fetch(API_URL + '/users' , {
    method: "POST", 
    body: JSON.stringify(userData),
    headers: new Headers({'content-type': 'application/json'})
  }).then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then(user => {
    loginUser();
  }).catch(error => {
    console.log(error);
  });
}

function loginUser() {
  let email = document.getElementById('email-input').value,
      pass = document.getElementById('password-input').value,
      userData = { "email": email, "password": pass };
  fetch(API_URL + '/auth/login' , {
    method: "POST", 
    body: JSON.stringify(userData),
    headers: new Headers({'content-type': 'application/json'})
  }).then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then(token => {
    console.log(token);
    setCookie(token, 'yourList.token');
    window.location.href = ORIGIN_URL;
  }).catch(error => {
    console.log(error);
  });
}


let homepage = function() {
  getAllUserLists();
}

let list = function() {
  console.log('list');
  let fullPath = window.location.hash.replace('#', ''),
      listId = fullPath.split(':')[1];
  currentList = new List(listId);
}

let sign_in = function() {
  console.log('sign_in');
}

let sign_up = function() {
  console.log('sign_up');
}

let router = new Router([
  new Route('home', 'home.html', homepage, true),
  new Route('list', 'list.html', list),
  new Route('sign_in', 'sign_in.html', sign_in),
  new Route('sign_up', 'sign_up.html', sign_up)
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

fetchList();
