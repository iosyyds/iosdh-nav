# 甜甜导航（Tiantian Nav）

基于 **Next.js 16 + Tailwind CSS 4** 构建的专业 iOS 资源导航站，采用 **Z-Pattern Layout（Z 型布局）** 设计风格。

## 功能特性

- **9 大分类，297+ 精选站点**：iOS 资源（网盘 / 捷径 / 签名工具 / 网站 / TG 资源）、其他网盘、AI 工具、网盘云储、购物网站、社区资讯、常用工具、素材资源、UED 团队
- **全站搜索**：按站点名称 / 网址 / 描述实时过滤
- **分类筛选**：一键切换分类快速定位
- **Z-Pattern 布局**：左上 Logo、右上 CTA、中间核心价值、左下信任标识、右下最终 CTA
- **响应式**：桌面完整 Z 型路径，平板缩小间距，手机垂直堆叠
- **无障碍**：WCAG AA 对比度、键盘可达、`prefers-reduced-motion` 降级

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可预览。

## 生产构建

```bash
npm run build
npm run start
```

## 项目结构

```
app/
  layout.tsx        # 根布局 + SEO 元数据
  page.tsx          # 主页（Z-Pattern 布局）
  globals.css       # 全局样式
components/
  SearchBox.tsx     # 搜索框
  SiteCard.tsx      # 站点卡片
lib/
  sites.ts          # 站点数据（自动生成）
```

## 部署

推荐使用 [Vercel](https://vercel.com/new) 一键部署（Next.js 原生支持）。

```bash
npm run build
```

## 数据来源

站点数据整理自公开网络导航信息，仅作网址收录与分享，所有站点版权归原作者所有。

## 许可证

MIT
