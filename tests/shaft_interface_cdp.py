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
24|              const form = document.querySelector('#shaft-form');
25|              form.elements.momento.value = '1000';
26|              form.elements.torque.value = '500';
27|              form.elements.diametro.value = '30';
28|              form.requestSubmit();
29|              return {
30|                sigma: document.querySelector('#shaft-sigma').textContent,
31|                tau: document.querySelector('#shaft-tau').textContent,
32|                vm: document.querySelector('#shaft-vm').textContent,
33|                tresca: document.querySelector('#shaft-tresca').textContent,
34|                errorHidden: document.querySelector('#shaft-error').hidden,
35|                title: document.title,
36|              };
37|            })()""",
38|            "awaitPromise": True,
39|            "returnByValue": True,
40|        })
41|
42|    actual = message["result"]["result"]["value"]
43|    assert actual["sigma"] == "0,377", actual
44|    assert actual["tau"] == "0,094", actual
45|    assert actual["vm"] == "0,411", actual
46|    assert actual["tresca"] == "0,422", actual
47|    assert actual["errorHidden"], actual
48|    assert "Flexão e torção" in actual["title"], actual
49|    print(f"Interface do módulo 02 validada: {actual}")
50|
51|
52|if __name__ == "__main__":
53|    main()
54|