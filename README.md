# 古人云vPush-SDK

> 社区版vPush SDK模块    
> https://guren.cloud    
> 更新：2018/12/07    

## 文档
详细文档请登陆开发者后台，点击左侧的推送文档即可。    
[https://dev.vpush.cloud](https://dev.vpush.cloud)

## 配置
后台创建应用后，复制ID，编辑`config.js`文件，填写`id`变量即可。   

**域名：** 登陆微信开发者后台，设置添加一个request域名：

~~https://vpush2.safedog.cc~~ （旧接口，请勿使用）    
~~https://cloud.safedog.cc~~  （旧的备案过期接口，不影响已配置的用户，新用户建议采用下方新接口）    

> https://cloud.mssnn.cn

提示：如果你需要在小程序中下载小程序码（比如生成海报），那么需要添加一个downloadFile域名（同上）

## 使用

### 接口
参考小程序开发文档的form组件，代码如下：

```wxml
<form report-submit bindsubmit='vPushAdd'>
  <button form-type='submit'>点击我添加formId</button>
</form>
```

我们在页面的JS文件添加一个`vPushAdd`函数，代码如下：

``` js
const vPush = require("../../libs/vpush-sdk/_vpush.js");
Page({
  // 在这里加上vPush方法提供组件调用
  vPushAdd: vPush.add.bind(vPush),
  data: {},
  onLoad: function (options) {}
})
```

### 组件
微信小程序页面`.json`配置文件加入组件的引用：
``` json
{
  "usingComponents": {
    "vpush-view": "/libs/vpush/view"
  }
}
```
然后就可以在页面中进行使用了：
``` wxml
<vpush-view>
  <view>
    <text>点击我即可自动收集推送凭证</text>
  </view>
</vpush-view>
```

## 帮助
如果您在使用的过程中有不明白的地方，可以加入我们的星球寻求最精准的解决方案：

![](https://guren.cloud/assets/qr/zsxq.jpg)