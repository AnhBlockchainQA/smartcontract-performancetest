const superagent = require("superagent");
const { logger } = require("../utils/Logger");
require('custom-env').env(true);

class BaseAPI {
  constructor(headers = {}, baseUrl) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.request = superagent;
  }

  async get(url, headers = {}, query = {}) {
    url = url.startsWith("/") ? url : `/${url}`;
    logger.info("Sending API GET " + this.baseUrl + url + "...");
    logger.info("Query params list: " + query);
    const res = await this.request
      .get(this.baseUrl + url)
      .set(headers)
      .query(query)
      .ok((res) => res.status < 500);

    return res;
  }

  async post(url, body = {}, headers = {}) {
    url = url.startsWith("/") ? url : `/${url}`;
    logger.info("Sending API POST " + this.baseUrl + url + "...");
    logger.info("Body payload: " + JSON.stringify(body));
    logger.info("Request headers: " + String(headers))
    const res = await this.request
      .post(this.baseUrl + url)
      .send(body)
      .set(headers)
      .ok((res) => res.status < 500);

    return res;
  }

  async put(url, body = {}, headers = {}) {
    url = url.startsWith("/") ? url : `/${url}`;
    logger.info("Sending API PUT " + this.baseUrl + url + "...");
    logger.info("Body payload: " + body);
    const res = await this.request
      .put(this.baseUrl + url)
      .send(body)
      .set(headers)
      .ok((res) => res.status < 500);

    return res;
  }

  async patch(url, body = {}, headers = {}) {
    url = url.startsWith("/") ? url : `/${url}`;
    logger.info("Sending API PATCH " + this.baseUrl + url + "...");
    logger.info("Body payload: " + body);
    const res = await this.request
      .patch(this.baseUrl + url)
      .send(body)
      .set(headers)
      .ok((res) => res.status < 500);

    return res;
  }

  async delete(url, headers = {}) {
    url = url.startsWith("/") ? url : `/${url}`;
    logger.info("Sending API DELETE " + this.baseUrl + url + "...");
    const res = await this.request
      .delete(this.baseUrl + url)
      .set(headers)
      .ok((res) => res.status < 500);

    return res;
  }
}

module.exports = BaseAPI;
