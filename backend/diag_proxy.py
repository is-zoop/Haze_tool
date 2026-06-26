import asyncio
import httpx

URL = "http://127.0.0.1:8090/api/v1/namespaces/haze-runtime/services/mcp-http-test:8000/proxy/mcp"
BODY = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "test", "version": "1.0"}
    }
}

async def test(label: str, **kwargs) -> None:
    print(f"\n--- {label} ---")
    try:
        async with httpx.AsyncClient(verify=False, **kwargs) as client:
            async with client.stream("POST", URL, json=BODY, timeout=5.0) as resp:
                content = await resp.aread()
                print(f"Status: {resp.status_code}  body: {content[:120]}")
    except Exception as e:
        print(f"Error: {e}")

async def main() -> None:
    # 默认（复现 502）
    await test("默认 httpx（gzip, deflate）")
    # 禁用 accept-encoding
    await test("禁用 Accept-Encoding", headers={"Accept-Encoding": "identity"})
    # trust_env=False（排除系统代理干扰）
    await test("trust_env=False", trust_env=False)
    # 两者都加
    await test("identity + trust_env=False", headers={"Accept-Encoding": "identity"}, trust_env=False)

asyncio.run(main())
