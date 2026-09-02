// 甜甜导航 - 站点数据（自动生成）
import { categories_part1 as cat1 } from "./categories_part1";
import { categories_part2 as cat2 } from "./categories_part2";
import { categories_part3 as cat3 } from "./categories_part3";

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

export const categories: Record<string, Site[]> = { ...cat1, ...cat2, ...cat3 };

export const navGroups: NavGroup[] = [{"id": "ios", "name": "iOS资源", "icon": "📱", "desc": "iOS网盘 / 捷径 / 签名工具 / 网站 / TG资源", "cats": ["iOS网盘", "iOS捷径", "IOS签名工具", "iOS网站", "TG资源"]}, {"id": "other-pan", "name": "其他网盘", "icon": "📦", "desc": "Galgame仓库与个人资源分享网盘", "cats": ["其他网盘"]}, {"id": "ai", "name": "AI工具", "icon": "🤖", "desc": "ChatGPT、豆包、DeepSeek 等主流 AI 助手", "cats": ["AI工具"]}, {"id": "cloud", "name": "网盘云储", "icon": "☁️", "desc": "百度网盘、阿里云盘等云存储服务", "cats": ["网盘云储"]}, {"id": "shop", "name": "购物网站", "icon": "🛒", "desc": "流量卡、证书等实用购物站点", "cats": ["购物网站"]}, {"id": "news", "name": "社区资讯", "icon": "📰", "desc": "互联网科技媒体与设计师社区", "cats": ["社区资讯"]}, {"id": "tools", "name": "常用工具", "icon": "🧰", "desc": "在线配色 / 插件 / 动效 / 在线工具", "cats": ["在线配色", "Chrome插件", "交互动效", "图形创意", "在线工具", "界面设计"]}, {"id": "assets", "name": "素材资源", "icon": "🎨", "desc": "平面素材 / LOGO / Mockup / PPT 等", "cats": ["平面素材", "LOGO设计", "Mockup", "PPT资源", "Sketch资源", "图标素材", "UI资源", "字体资源", "摄影图库"]}, {"id": "ued", "name": "UED团队", "icon": "👥", "desc": "腾讯、京东、Google 等大厂设计团队", "cats": ["UED团队"]}];
