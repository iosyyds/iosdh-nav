"use client";

// jsonbin.io 免费 JSON 存储服务封装
// 文档：https://jsonbin.io/api-reference
// 免费额度：10000 请求/月，支持公开读取 + API Key 更新

const API_BASE = "https://api.jsonbin.io/v3";

export interface JsonbinConfig {
  binId: string; // 数据存储的 Bin ID
  apiKey: string; // X-Master-Key，用于创建/更新
  accessKey?: string; // X-Access-Key，私有 bin 读取时需要（公开 bin 留空）
}

// 读取 bin 最新数据
export async function readBin(config: JsonbinConfig): Promise<unknown> {
  const url = `${API_BASE}/b/${config.binId}/latest`;
  const headers: Record<string, string> = {};
  if (config.accessKey) headers["X-Access-Key"] = config.accessKey;

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`读取失败（HTTP ${res.status}）：${text || res.statusText}`);
  }
  const json = (await res.json()) as { record?: unknown };
  return json.record ?? json;
}

// 更新 bin 数据（覆盖写入）
export async function updateBin(
  config: JsonbinConfig,
  data: unknown,
  versioning: boolean = false
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE}/b/${config.binId}${versioning ? "" : "?meta=false"}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "X-Master-Key": config.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { success: false, message: `更新失败（HTTP ${res.status}）：${text || res.statusText}` };
  }
  return { success: true, message: "数据已同步到 jsonbin 云端" };
}

// 创建新 bin（首次使用时调用）
export async function createBin(
  apiKey: string,
  data: unknown,
  name: string = "iosdh-nav-data",
  isPrivate: boolean = false
): Promise<{ success: boolean; binId?: string; message: string }> {
  const url = `${API_BASE}/b`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Master-Key": apiKey,
      "Content-Type": "application/json",
      "X-Bin-Name": name,
      "X-Bin-Private": isPrivate ? "true" : "false",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { success: false, message: `创建失败（HTTP ${res.status}）：${text || res.statusText}` };
  }
  const json = (await res.json()) as { metadata?: { id?: string } };
  const binId = json.metadata?.id;
  if (!binId) {
    return { success: false, message: "创建成功但未获取到 Bin ID，请在 jsonbin.io 控制台查看" };
  }
  return { success: true, binId, message: `Bin 创建成功：${binId}` };
}

// 验证 API Key 是否有效
export async function verifyApiKey(apiKey: string): Promise<{ valid: boolean; message: string }> {
  if (!apiKey) return { valid: false, message: "API Key 为空" };
  try {
    // 尝试获取用户信息来验证 key
    const res = await fetch(`${API_BASE}/u`, {
      headers: { "X-Master-Key": apiKey },
    });
    if (res.ok) {
      const json = (await res.json()) as { user?: { name?: string } };
      return { valid: true, message: `验证成功：${json.user?.name ?? "有效用户"}` };
    }
    return { valid: false, message: `API Key 无效（HTTP ${res.status}）` };
  } catch (e) {
    return { valid: false, message: `网络错误：${e instanceof Error ? e.message : String(e)}` };
  }
}
