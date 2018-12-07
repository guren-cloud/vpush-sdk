/**
 * 古人云vPush推送平台
 * ==================
 * 核心模块->for 社区版
 * 更新于：2018/12/07
 * 社区版：https://guren.cloud
 * 高级版：https://mssnn.cn
 * GitHub：https://github.com/guren-cloud
 */

const CONFIG = require("./config");

class vPush {
  constructor (vPushId) {
    // 域名等配置信息
    this.VPUSH_API = "https://cloud.mssnn.cn/vpush";
    this.VPUSH_KEY = "guren_cloud_vpush";
    this.VPUSH_APP_ID = vPushId;

    if (!vPushId) {
      throw new Error("[vPush.init] 初始化请传递你在vPush控制台创建的应用ID");
    }

    this.TAGS = [];
    this.ALIAS = "";
    this.OPEN_ID = "";

    const INFO = wx.getSystemInfoSync();
    this.INFO = {
      sdk: INFO.SDKVersion,
      language: INFO.language,
      model: INFO.model,
      platform: INFO.platform,
      system: INFO.system,
      version: INFO.version
    };
    
    // 获取本地存储的openId
    try {
      let cache = wx.getStorageSync('VPUSH_OPEN_ID');
      if (cache && cache.length > 10) this.OPEN_ID = cache;
    } catch (e) {}

    this.init();
  }

  /**
   * 初始化函数，获取用户的openId
   */
  init () {
    if (this.OPEN_ID) return console.warn("[vPush.init] 已初始化用户openId：", this.OPEN_ID);

    wx.login({
      success: ret => {
        this._request('/functions/getOpenId', {
          appId: this.VPUSH_APP_ID,
          code: ret.code
        }).then(data => {
          const { openId } = data;
          if (!openId) return console.warn("[!] 获取openId失败：", data);
          this.OPEN_ID = openId;
          wx.setStorageSync("VPUSH_OPEN_ID", openId);
        })
      }
    })
  }

  /**
   * 添加推送凭证
   * @param e Object|String
   */
  add (e) {
    var formId = '';
    if (typeof e === 'object') {
      formId = e.detail.formId;
    } else {
      formId = String(e);
    }

    this._create(formId, result => {
      console.log('[vpush.add.result]', result);
    })
  }

  /**
   * 设置短名标识
   */
  setAlias (alias) {
    this.ALIAS = alias;
  }

  /**
   * 设置标签
   * 参数可以是string或者array
   */
  setTags (tag) {
    if (typeof tag === 'string') {
      this.TAGS = [tag];
    } else if (Array.isArray(tag)) {
      this.TAGS = tag;
    } else {
      throw new Error('[!] tag 应为string或array类型！')
    }
  }

    /**
   * 推送给当前用户
   * data = {id, secret, data, path}
   */
  pushToMe (data, callback) {
    return this._request("/functions/PUSH_API", Object.assign({}, data, {
      openId: this.OPEN_ID
    }));
  }

  /**
   * 发送推送凭证到远程服务器
   * @param formId String
   * @param callback Function
   */
  _create (formId, callback) {
    if (!this.OPEN_ID) return console.warn("[!] vPush::尚未初始化");
    if (!formId) return console.warn('[vpush.create] 未定义formId');
    if (formId.startsWith('the')) return console.warn('[vpush.formId]', formId);
    formId = String(formId);
    if (formId === 'undefined') return console.warn('[vpush.create] formId未定义');

    this._request("/classes/FormIds", Object.assign({}, this.INFO, {
      formId,
      openId: this.OPEN_ID,
      tags: this.TAGS,
      alias: this.ALIAS,
      app: {
        __type: 'Pointer',
        className: 'Apps',
        objectId: this.VPUSH_APP_ID
      }
    })).then(data => {
      console.log('[+] 添加推送凭证成功', data);
      callback && callback(true);
    }).catch(err => {
      console.warn("[!] 添加推送凭证失败：", err);
      callback && callback(false);
    });
  }

  /**
   * 请求API函数
   * @param uri String
   * @param data Object
   */
  _request (uri, data) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: this.VPUSH_API + uri,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': this.VPUSH_KEY
        },
        dataType: 'json',
        data,
        success: res => {
          RES(res.data.result.data);
        },
        fail: REJ
      })
    });
  }
}

module.exports = new vPush(CONFIG.id);