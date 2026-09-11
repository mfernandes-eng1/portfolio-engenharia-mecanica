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
              const form = document.querySelector('#shaft-form');
              form.elements.momento.value = '1000';
              form.elements.torque.value = '500';
              form.elements.diametro.value = '30';
              form.requestSubmit();
              return {
                sigma: document.querySelector('#shaft-sigma').textContent,
                tau: document.querySelector('#shaft-tau').textContent,
                vm: document.querySelector('#shaft-vm').textContent,
                tresca: document.querySelector('#shaft-tresca').textContent,
                errorHidden: document.querySelector('#shaft-error').hidden,
                title: document.title,
              };
            })()""",
            "awaitPromise": True,
            "returnByValue": True,
        })

    actual = message["result"]["result"]["value"]
    assert actual["sigma"] == "0,377", actual
    assert actual["tau"] == "0,094", actual
    assert actual["vm"] == "0,411", actual
    assert actual["tresca"] == "0,422", actual
    assert actual["errorHidden"], actual
    assert "Flexão e torção" in actual["title"], actual
    print(f"Interface do módulo 02 validada: {actual}")


if __name__ == "__main__":
    main()
