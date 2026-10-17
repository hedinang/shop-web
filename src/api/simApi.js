import BaseApi from "./baseApi";
import {BID, SIM} from "./apiConstant";

class SimApi extends BaseApi {
  list(payload) {
    return this.post("free" + SIM + "list", payload);
  }

  getSim(payload) {
    return this.get("free" + SIM + "{simId}", payload);
  }

  getBid(bid) {
    return this.post(`${SIM}/public/detail`, bid);
  }

  create(payload) {
    return this.post("secure" + SIM + "create", payload);
  }
}

export default SimApi;
