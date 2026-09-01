// 甜甜导航 - 站点数据（自动生成）
export interface Site {
  id: string;
  name: string;
  url: string;
  desc: string;
  icon?: string;
}
export interface NavGroup {
  id: string;
  name: string;
  icon: string;
  desc: string;
  cats: string[];
}
export const categories: Record<string, Site[]> = {
  "iOS网盘": [
    { id: "887", name: "甜甜网盘", url: "https://pan.puaaa.cn", desc: "免费免费一直免费开放！", icon: "https://iosdh.cn/wp-content/uploads/2025/10/%E7%94%9C%E7%94%9C%E7%BD%91%E7%9B%98icon.svg" },
    { id: "928", name: "宅哥技术网盘", url: "https://pan.312752.cn", desc: "宅哥技术网盘" },
    { id: "931", name: "IPA分享站", url: "https://pan.cjq6525.xyz", desc: "IPA分享站" },
    { id: "925", name: "91网盘", url: "https://alist.91ios.fun", desc: "91网盘-ipa资源网盘" },
    { id: "935", name: "DaPeng网盘", url: "https://wp.sha0p.cn", desc: "DaPeng网盘｜iOS资源分享网-IPA资源库-巨魔商店IPA软件资源-网络资源分享" },
    { id: "930", name: "IOS神器", url: "https://iossq.top", desc: "IOS神器" },
    { id: "923", name: "平凡", url: "https://pan.iosi.vip", desc: "平凡" },
    { id: "905", name: "小海网盘", url: "https://pan.weblyc.cn", desc: "小海资源分享网盘" },
    { id: "912", name: "鹏客网盘", url: "https://peck.cool", desc: "peckios" },
    { id: "932", name: "薛萌萌网盘", url: "https://pan.xmmqm.cn", desc: "薛萌萌网盘" },
    { id: "946", name: "爱锋助手资源盘", url: "https://pan.yhios.cn", desc: "爱锋助手资源盘专注于iOS应用分享，提供免费企业证书、IPA签名包、精品iOS软件与游戏、微信多开插件、IPA安装包、微信主题美化等，支持在线安装与极速下载。" },
    { id: "908", name: "顷酉网盘", url: "https://pan.586226.xyz", desc: "顷酉网盘-为果粉提供的资源站" },
    { id: "913", name: "优创网盘", url: "https://pan.ucgod.cn", desc: "优创网盘 - iuczy优创AppStore" },
    { id: "924", name: "小艾网盘", url: "http://dh.agxmt.com", desc: "小艾网盘" },
    { id: "927", name: "萌仙科技网盘", url: "https://pan.mxwlcm.cn", desc: "萌仙科技网盘" },
    { id: "926", name: "知网云盘", url: "https://pan.xyyh.xyz", desc: "知网云盘" },
    { id: "914", name: "酷乐网盘", url: "https://pan.6789o.com", desc: "酷乐网盘" },
    { id: "899", name: "DumpApp", url: "https://pan.dumpapp.com", desc: "DumpApp" },
    { id: "910", name: "微速云盘", url: "https://pan.iosdz.cn", desc: "微速 云盘" },
    { id: "901", name: "小萝卜云盘", url: "https://yun.lbbb.cc", desc: "小萝卜云盘" },
  ],
  "TG资源": [
    { id: "1070", name: "资源分享客栈-Applnn", url: "https://t.me/zyfxlnn", desc: "" },
    { id: "1060", name: "彭于晏iOS破解讨论交流", url: "https://t.me/plus8889", desc: "" },
    { id: "1061", name: "iOS破解插件分享", url: "https://t.me/iparxwy", desc: "" },
    { id: "1046", name: "ios白嫖资源分享 Chat", url: "https://t.me/iosjl_AHKJ", desc: "" },
    { id: "1074", name: "小白菜·iOS游戏分享中心", url: "https://t.me/xiaobaicaifx", desc: "" },
    { id: "1072", name: "巨魔商店 Pro", url: "https://t.me/TrollStorePro", desc: "" },
    { id: "1036", name: "免费白嫖｜破解游戏", url: "https://t.me/svip660", desc: "" },
    { id: "1054", name: "IOS 大杂烩", url: "https://t.me/IOSGAN", desc: "" },
    { id: "1073", name: "宝藏巨魔软件交流群", url: "https://t.me/chatrxwy", desc: "" },
    { id: "1069", name: "曹老板白嫖分享社", url: "https://t.me/clbfxs", desc: "" },
    { id: "1056", name: "秋月资源分享社-软件|辅助", url: "https://t.me/qiuyuezt", desc: "" },
    { id: "1052", name: "ios插件仓库", url: "https://t.me/iosck_AHKJ", desc: "" },
    { id: "1066", name: "苓妹妹ios资源分享", url: "https://t.me/iosfulishare", desc: "" },
    { id: "1062", name: "ipa hack iPhone | iOS", url: "https://t.me/mihalsanch", desc: "" },
    { id: "1057", name: "叮当猫iOS资源/脚本频道", url: "https://t.me/chxm1023", desc: "" },
    { id: "1068", name: "Geek丨iOS软件分享", url: "https://t.me/Geek_iOS", desc: "" },
    { id: "1051", name: "油油资源分享", url: "https://t.me/youyousharechannel", desc: "" },
    { id: "1055", name: "TikTok资源分享", url: "https://t.me/tikdw", desc: "" },
    { id: "1065", name: "羊村资源分享社", url: "https://t.me/qwjhfx", desc: "" },
    { id: "1071", name: "胖虎の交流群", url: "https://t.me/gitbig_chat", desc: "" },
  ],
};
export const navGroups: NavGroup[] = [{"id": "ios", "name": "iOS资源", "icon": "📱", "desc": "iOS网盘 / 捷径 / 签名工具 / 网站 / TG资源", "cats": ["iOS网盘", "iOS捷径", "IOS签名工具", "iOS网站", "TG资源"]}];