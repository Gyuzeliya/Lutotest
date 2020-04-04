// Эта функция по идее должна быть импортирована,
// но упрощено и нужно её простейшим образом реализовать
const serverApiRequest = url => {
  /*simulate request*/
  return fetch(url)
    // TODO: Добавить в ответ сервера на 404 заголовок Access-Control-Allow-Origin
    .then(res => res.ok ? res.json() : Promise.reject(Error(res.statusText)))
    .catch(e => console.log(e))
};

// Можно выполнить по аналогии с serverApiRequest(), а можно лучше, см. подсказку ниже
const sendAnalytics = (url, data) => {
  /*sendBeacon maybe*/
  let result = navigator.sendBeacon(url, JSON.stringify(data));
  if (result) {
    console.log('Добавлено в очередь');
  } else {
    // TODO: Реализовать поддержку IE, Opera Mini
    // TODO: Изучить https://volument.com/blog/sendbeacon-is-broken
  }
};

/* Нужно:
    1 Сделать функцию рабочей в принципе не меняя логики но доступно ES8+
    2 Общая логика: запрос, если успех, то отправка данных в аналитику, обработка данных и их возврат
    3 Подсветить места, где ТЗ недостаточно
    4 Подсветить места, вероятно проблемные
*/
const requestData = async ({ id, param }) => {
  // should return [null, {v: 1}, {v: 4}, null] or Error (may return array (null | {v: number})[])
  let url = '//t.syshub.ru';
  let array = await serverApiRequest(`${url}/query/data/${id}/param/${param}`);
  let result = [];

  // after complete request if *not* Error call
  if(typeof array !== 'undefined') {
    sendAnalytics(`${url}/requestDone`, {
      type: "data",
      id: id,
      param: param
    });

    // фильтрация массива, извлечение значения v
    result = array.filter(item => item && item.hasOwnProperty('v')).map(item => item.v);
  }
  return result;
};

// app proto
// START DO NOT EDIT app
(async () => {
  const log = text => {
    const app = document.querySelector("#app");
    app.appendChild(document.createTextNode(JSON.stringify(text, null, 2)));
    app.appendChild(document.createElement("br"));
  };
  
  log(await requestData({ id: 1, param: "any" }));
  log(await requestData({ id: 4, param: "string" }));
  log(await requestData({ id: 4, param: 404 }));
})();
// END DO NOT EDIT app

