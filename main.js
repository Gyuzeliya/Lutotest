const serverApiRequest = url => {
  return fetch(url)
    // TODO: Добавить в ответ сервера на 404 заголовок Access-Control-Allow-Origin
    .then(res => res.ok ? res.json() : Promise.reject(Error(res.statusText)))
    .catch(err => console.log(err))
};

const sendAnalytics = (url, data) => {
  let result = navigator.sendBeacon(url, JSON.stringify(data));
  if (!result) {
    // TODO: Реализовать поддержку IE, Opera Mini
    // TODO: Изучить https://volument.com/blog/sendbeacon-is-broken
  }
};

const requestData = async ({ id, param }) => {
  let url = '//t.syshub.ru';
  let data = await serverApiRequest(`${url}/query/data/${id}/param/${param}`);
  let result = [];

  if(typeof data !== 'undefined') {
    // аналитика отправляется несмотря на возможное отсутствие валидных данных
    sendAnalytics(`${url}/requestDone`, {
      type: "data",
      id: id,
      param: param
    });

    // фильтрация массива, извлечение значения v
    result = data.filter(item => item && item.hasOwnProperty('v')).map(item => item.v);
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

