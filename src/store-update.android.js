"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_update_common_1 = require("./store-update.common");
var StoreUpdate = (function (_super) {
    __extends(StoreUpdate, _super);
    function StoreUpdate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StoreUpdate;
}(store_update_common_1.Common));
StoreUpdate.PLAY_STORE_ROOT_WEB = "https://play.google.com/store/apps/details?id=";
StoreUpdate.PLAY_STORE_HTML_TAGS_TO_GET_RIGHT_POSITION = "itemprop=\"softwareVersion\"> ";
StoreUpdate.PLAY_STORE_HTML_TAGS_TO_REMOVE_USELESS_CONTENT = "  </div> </div>";
StoreUpdate.PLAY_STORE_PACKAGE_NOT_PUBLISHED_IDENTIFIER = "We're sorry, the requested URL was not found on this server.";
exports.StoreUpdate = StoreUpdate;
//# sourceMappingURL=store-update.android.js.map