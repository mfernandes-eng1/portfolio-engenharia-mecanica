#!/usr/bin/env python3
import json
from urllib.request import urlopen

from websockets.sync.client import connect


def request(socket, request_id, method, params=None):
    socket.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
    while True:
        message = json.loads(socket.recv(timeout=5))
        if message.get("id") == request_id:
            return message


def main():
    with urlopen("http://127.0.0.1:9223/json/list", timeout=5) as response:
        pages = json.load(response)

    page = next(item for item in pages if item.get("url", "").endswith("/eixos.html"))
    with connect(page["webSocketDebuggerUrl"], open_timeout=5, close_timeout=2) as socket:
        request(socket, 1, "Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 1,
            "mobile": True,
        })
        message = request(socket, 2, "Runtime.evaluate", {
            "expression": """(() => {
              const bounds = (selector) => {
                const box = document.querySelector(selector).getBoundingClientRect();
                return { left: box.left, right: box.right, width: box.width };
              };
              return {
                viewport: innerWidth,
                documentWidth: document.documentElement.scrollWidth,
                diagram: bounds('.shaft-diagram'),
                form: bounds('#shaft-form'),
                output: bounds('.output-panel'),
                navHeight: document.querySelector('.site-header').getBoundingClientRect().height,
              };
            })()""",
            "returnByValue": True,
        })

    actual = message["result"]["result"]["value"]
    assert actual["documentWidth"] == actual["viewport"], actual
    for key in ("diagram", "form", "output"):
        assert actual[key]["left"] >= 0, actual
        assert actual[key]["right"] <= actual["viewport"], actual
    assert actual["navHeight"] <= 60, actual
    print(f"Layout mobile do módulo 02 validado: {actual}")


if __name__ == "__main__":
    main()
