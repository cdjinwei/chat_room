// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        chat_container: cc.Node,
        edit_box: cc.EditBox,
        me_chat_item: cc.Node,
        other_chat_item: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.connectServer();
    },

    connectServer() {
        let _this = this;
        this.conn = new WebSocket('ws://192.168.0.110:8123');

        this.conn.onopen = function (params) {
            console.log('client connected!');
            console.log(params);
        }
        this.conn.onmessage = function (event) {
            console.log('client get message!');
            console.log(event);
            _this.addChatItem(JSON.parse(event.data));
        }
        this.conn.onclose = function (params, params2) {
            console.log('client closed!');
            console.log(params, params2);
        }
        this.conn.onerror = function (params, params2) {
            console.log('client error!');
            console.log(params, params2);
        }

    },

    sendText() {
        let str = this.edit_box.string;
        if (this.conn) {
            this.conn.send(str);
        }
    },

    addChatItem(chat_data) {
        let item = this.createChatItem(chat_data);

        item.parent = this.chat_container;
    },

    createChatItem(data) {
        let item;
        if (data.side == 1) {
            item = cc.instantiate(this.me_chat_item);
        } else {
            item = cc.instantiate(this.other_chat_item);
        }

        let str_cmp = cc.find('bg/Label', item).getComponent(cc.Label);
        let bg_node = cc.find('bg', item);
        let lab_name = cc.find('head_icon/name', item);
        str_cmp.string = data.data;
        lab_name.getComponent(cc.Label).string = data.id;

        setTimeout(() => {
            item.height = bg_node.height > 120 ? bg_node.height + 20 : 120;    
        }, 100);
                
        return item;
    },

    closeConnection() {
        if (this.conn) {
            this.conn.close();
            this.conn = null;
        }
    }
    // update (dt) {},
});