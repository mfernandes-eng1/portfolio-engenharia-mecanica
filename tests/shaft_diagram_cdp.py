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
22|        message = request(socket, 1, "Runtime.evaluate", {
23|            "expression": """(() => {
24|              const box = (selector) => {
25|                const value = document.querySelector(selector).getBBox();
26|                return { x: value.x, y: value.y, width: value.width, height: value.height };
27|              };
28|              const face = box('.shaft-face');
29|              const body = box('.shaft-body');
30|              const loads = [...document.querySelectorAll('.shaft-load')];
31|              const torqueValue = loads[0].getBBox();
32|              const bendingValue = loads[1].getBBox();
33|              const torque = { x: torqueValue.x, y: torqueValue.y, width: torqueValue.width, height: torqueValue.height };
34|              const bending = { x: bendingValue.x, y: bendingValue.y, width: bendingValue.width, height: bendingValue.height };
35|              return {
36|                torqueGap: face.x - (torque.x + torque.width),
37|                bendingGap: body.y - (bending.y + bending.height),
38|                curvedBending: loads[1].getAttribute('d').includes('C'),
39|              };
40|            })()""",
41|            "returnByValue": True,
42|        })
43|
44|    actual = message["result"]["result"]["value"]
45|    assert actual["torqueGap"] >= 12, actual
46|    assert actual["bendingGap"] >= 30, actual
47|    assert actual["curvedBending"], actual
48|    print(f"Folgas do diagrama validadas: {actual}")
49|
50|
51|if __name__ == "__main__":
52|    main()
53|