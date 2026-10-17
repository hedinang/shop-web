import { ORDER } from "./apiConstant";
import BaseApi from "./baseApi";

class OrderApi extends BaseApi {
  list(payload) {
    return this.post(`${ORDER}/order-list`, payload);
  }

  getBid(bid) {
    return this.post(`${ORDER}/public/detail`, bid);
  }

  addToCard(payload) {
    return this.post(`${ORDER}/store`, payload);
  }

  changeStatus(payload) {
    return this.post(`${ORDER}/change-status`, payload);
  }

  changeStatusByOrderDate(payload) {
    return this.post(`${ORDER}/order-date/change-status`, payload);
  }

  changeStatusByItemDate(payload) {
    return this.post(`${ORDER}/item-date/change-status`, payload);
  }
}
export default OrderApi;
