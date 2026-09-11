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
        message = request(socket, 1, "Runtime.evaluate", {
            "expression": """(() => {
              const box = (selector) => {
                const value = document.querySelector(selector).getBBox();
                return { x: value.x, y: value.y, width: value.width, height: value.height };
              };
              const face = box('.shaft-face');
              const body = box('.shaft-body');
              const loads = [...document.querySelectorAll('.shaft-load')];
              const torqueValue = loads[0].getBBox();
              const bendingValue = loads[1].getBBox();
              const torque = { x: torqueValue.x, y: torqueValue.y, width: torqueValue.width, height: torqueValue.height };
              const bending = { x: bendingValue.x, y: bendingValue.y, width: bendingValue.width, height: bendingValue.height };
              return {
                torqueGap: face.x - (torque.x + torque.width),
                bendingGap: body.y - (bending.y + bending.height),
                curvedBending: loads[1].getAttribute('d').includes('C'),
              };
            })()""",
            "returnByValue": True,
        })

    actual = message["result"]["result"]["value"]
    assert actual["torqueGap"] >= 12, actual
    assert actual["bendingGap"] >= 30, actual
    assert actual["curvedBending"], actual
    print(f"Folgas do diagrama validadas: {actual}")


if __name__ == "__main__":
    main()
