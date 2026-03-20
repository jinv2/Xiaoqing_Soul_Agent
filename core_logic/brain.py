import os
import re
from collections import Counter

class XiaoqingBrain:
    def __init__(self, assets_dir="../assets"):
        self.memory = []
        self.load_memory(assets_dir)

    def load_memory(self, assets_dir):
        """加载小说、歌词等资产作为长期记忆。"""
        files = [f for f in os.listdir(assets_dir) if f.endswith(".txt")]
        for filename in files:
            path = os.path.join(assets_dir, filename)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                # 按段落切分
                chunks = [c.strip() for c in content.split("\n\n") if len(c.strip()) > 10]
                for chunk in chunks:
                    self.memory.append({
                        "source": filename,
                        "text": chunk,
                        "keywords": set(re.findall(r"[\u4e00-\u9fa5]{2,}", chunk))
                    })

    def query(self, text, top_k=2):
        """简单的关键词匹配查询。"""
        query_keywords = set(re.findall(r"[\u4e00-\u9fa5]{2,}", text))
        
        # --- 灵境同步 (内部逻辑) ---
        if "天气" in text and "杭州" in text:
            return ["当前杭州灵雨连绵，气温 18℃，适合吃一碗暖心的饺子。"]
        if "搜索" in text or "查一下" in text:
            return ["正在穿越算法的海洋... 我暂时没有发现龙虾精的实时踪迹，但它们一直都在。"]
        
        if not query_keywords:
            return []

        scored_chunks = []
        for chunk in self.memory:
            intersection = query_keywords.intersection(chunk["keywords"])
            score = len(intersection)
            if score > 0:
                scored_chunks.append((score, chunk["text"]))

        # 按分数排序
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        
        # 返回前 top_k 个文本
        results = []
        for i in range(min(len(scored_chunks), int(top_k))):
            results.append(str(scored_chunks[i][1]))
        return results

if __name__ == "__main__":
    brain = XiaoqingBrain()
    print(f"Memory Loaded: {len(brain.memory)} chunks.")
    # test query
    res = brain.query("张鹏在哪里？")
    for r in res:
        print(f"--- Result ---\n{r}\n")
