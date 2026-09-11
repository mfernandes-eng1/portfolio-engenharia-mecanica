1|#!/usr/bin/env python3
2|import json
3|from urllib.request import urlopen
4|
5|from websockets.sync.client import connect
6|
7|
8|def request(socket, request_id, method, params=None):
9|    socket.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
10|    while True:
11|        message = json.loads(socket.recv(timeout=5))
12|        if message.get("id") == request_id:
13|            return message
14|
15|
16|def main():
17|    with urlopen("http://127.0.0.1:9223/json/list", timeout=5) as response:
18|        pages = json.load(response)
19|
20|    page = next(item for item in pages if item.get("url", "").endswith("/eixos.html"))
21|    with connect(page["webSocketDebuggerUrl"], open_timeout=5, close_timeout=2) as socket:
22|        request(socket, 1, "Emulation.setDeviceMetricsOverride", {
23|            "width": 390,
24|            "height": 844,
25|            "deviceScaleFactor": 1,
26|            "mobile": True,
27|        })
28|        message = request(socket, 2, "Runtime.evaluate", {
29|            "expression": """(() => {
30|              const bounds = (selector) => {
31|                const box = document.querySelector(selector).getBoundingClientRect();
32|                return { left: box.left, right: box.right, width: box.width };
33|              };
34|              return {
35|                viewport: innerWidth,
36|                documentWidth: document.documentElement.scrollWidth,
37|                diagram: bounds('.shaft-diagram'),
38|                form: bounds('#shaft-form'),
39|                output: bounds('.output-panel'),
40|                navHeight: document.querySelector('.site-header').getBoundingClientRect().height,
41|              };
42|            })()""",
43|            "returnByValue": True,
44|        })
45|
46|    actual = message["result"]["result"]["value"]
47|    assert actual["documentWidth"] == actual["viewport"], actual
48|    for key in ("diagram", "form", "output"):
49|        assert actual[key]["left"] >= 0, actual
50|        assert actual[key]["right"] <= actual["viewport"], actual
51|    assert actual["navHeight"] <= 60, actual
52|    print(f"Layout mobile do módulo 02 validado: {actual}")
53|
54|
55|if __name__ == "__main__":
56|    main()
57|