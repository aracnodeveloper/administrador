// clase generica para el consumo de APIS

import axios from 'axios'; // Importa la biblioteca axios si no la tienes instalada
import Config from '../global/config.jsx';

class GenericService {

  async get(url) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async post(url, params) {
    var headers = {
      'Content-Type': 'application/json; charset=utf-8'
    }

    try {
      const response = await fetch(url, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(params)
      });


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if ([401, 403, 1005, 100002, 100001].includes(data.codigo)) {
        localStorage.removeItem('datos')
        window.location.href = "/";
      }
      return data;
    } catch (error) {
      console.error('Cannot post to ' + url + '. error:' + error.message);
      return { "code": -1, "msg": `Cannot post to ${url}. error: ${error.message}` };
    }
  }
}
export default GenericService;