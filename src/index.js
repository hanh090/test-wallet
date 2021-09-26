import WalletConnect from "@walletconnect/browser";

// get session from localstorage

const session = localStorage.getItem("session");
if (session) {
  document.getElementById("session").value = JSON.stringify(
    JSON.parse(session),
    null,
    4
  );
}

const setSession = session => {
  localStorage.setItem("session", JSON.stringify(session));
  document.getElementById("session").value = JSON.stringify(session, null, 4);
};

document.getElementById("connect").onclick = () => {
  console.log("trying to connect!", document.getElementById("uri").value);

  const conn = new WalletConnect({
    uri: document.getElementById("uri").value
  });

  conn.on("session_request", (error, payload) => {
    console.log("session_request", {
      error,
      payload: JSON.stringify(payload, null, 4)
    });
    conn.approveSession({
      accounts: ["0x865fC998bE265a8E0D03b1c15e68c0d24eE04F37"], //
      chainId: 1
    });

    setSession(conn.session);
  });

  conn.on("call_request", (error, payload) => {
    console.log({ error, payload });
    console.log("sending response");
    conn.approveRequest({
      id: payload.id,
      result: "0x1234"
    });
  });
};

document.getElementById("reuse").onclick = () => {
  const conn = new WalletConnect(
    JSON.parse(document.getElementById("session").value)
  );

  conn.on("call_request", (error, payload) => {
    console.log({ error, payload });
    console.log("sending response");
    conn.approveRequest({
      id: payload.id,
      result: "0x1234"
    });
  });
};
