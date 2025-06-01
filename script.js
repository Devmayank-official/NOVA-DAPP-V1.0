
let miningRate = 0.01;
let isMining = false;
let miningInterval = null;

let balances = JSON.parse(localStorage.getItem("novaBalances")) || {
  novaPolygon: 0,
  novaBNB: 0,
  novaETH: 0,
  space: 0,
  nv: 0
};
let userName = localStorage.getItem("novaUserName") || "";

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
  updateUI();
}

function updateUI() {
  const format = val => val.toFixed(4);
  document.getElementById("novaBalance").innerText = format(balances.novaPolygon);
  document.getElementById("novaBalanceSwap").innerText = format(balances.novaPolygon);
  document.getElementById("novaBalanceMint").innerText = format(balances.novaPolygon);
  document.getElementById("novaBalanceProfile").innerText = format(balances.novaPolygon);
  document.getElementById("novaPolygon").innerText = format(balances.novaPolygon);
  document.getElementById("novaBNB").innerText = format(balances.novaBNB);
  document.getElementById("novaETH").innerText = format(balances.novaETH);
  document.getElementById("novaBNBProfile").innerText = format(balances.novaBNB);
  document.getElementById("novaETHProfile").innerText = format(balances.novaETH);
  document.getElementById("spaceBalanceSwap").innerText = format(balances.space);
  document.getElementById("spaceBalanceProfile").innerText = format(balances.space);
  document.getElementById("nvBalance").innerText = format(balances.nv);
  document.getElementById("nvBalanceProfile").innerText = format(balances.nv);

  let total = balances.novaPolygon + balances.novaBNB + balances.novaETH;
  document.getElementById("totalBalance").innerText = format(total);

  if (userName) document.getElementById("profileName").innerText = userName;
  localStorage.setItem("novaBalances", JSON.stringify(balances));
}

document.getElementById("startMiningBtn").addEventListener("click", () => {
  if (!isMining) {
    miningInterval = setInterval(() => {
      balances.novaPolygon += miningRate / 60;
      updateUI();
    }, 1000);
    document.getElementById("startMiningBtn").innerText = "Stop Mining";
    isMining = true;
  } else {
    clearInterval(miningInterval);
    document.getElementById("startMiningBtn").innerText = "Start Mining";
    isMining = false;
  }
});

document.getElementById("swapBtn").addEventListener("click", () => {
  const amt = parseFloat(document.getElementById("swapAmount").value);
  if (isNaN(amt) || amt <= 0 || amt > balances.novaPolygon) {
    alert("Invalid amount!");
    return;
  }
  const fee = amt * 0.001;
  balances.novaPolygon -= amt;
  balances.space += (amt - fee);
  updateUI();
  alert(`Swapped ${amt.toFixed(4)} NOVA → ${(amt - fee).toFixed(4)} SPACE`);
});

function mintNV() {
  const amt = parseFloat(document.getElementById("mintAmount").value);
  if (isNaN(amt) || amt <= 0 || amt > balances.novaPolygon) {
    alert("Invalid amount!");
    return;
  }
  balances.novaPolygon -= amt;
  balances.nv += amt * 10;
  updateUI();
  alert(`Minted ${amt} NOVA → ${amt * 10} NV`);
}

function bridgeTokens() {
  const from = document.getElementById("fromChain").value;
  const to = document.getElementById("toChain").value;
  const amt = parseFloat(document.getElementById("bridgeAmount").value);
  const status = document.getElementById("bridgeStatus");

  if (from === to) {
    status.innerHTML = `<p class="error">Select different chains</p>`;
    return;
  }

  if (isNaN(amt) || amt <= 0) {
    status.innerHTML = `<p class="error">Enter valid amount</p>`;
    return;
  }

  if (amt > balances[from]) {
    status.innerHTML = `<p class="error">Insufficient balance</p>`;
    return;
  }

  status.innerHTML = `<p class="loading">Bridging in progress...</p>`;

  setTimeout(() => {
    const failed = Math.random() < 0.2;
    if (failed) {
      status.innerHTML = `<p class="error">Bridge failed. Try again.</p>`;
    } else {
      balances[from] = Math.max(0, balances[from] - amt);
      balances[to] += amt;
      updateUI();
      status.innerHTML = `<p class="success">Bridge successful!</p>`;
    }
  }, Math.random() * 5000 + 3000);
}

function saveName() {
  const name = document.getElementById("userNameInput").value.trim();
  if (name) {
    userName = name;
    localStorage.setItem("novaUserName", name);
    updateUI();
  }
}

window.onload = () => {
  showTab("miningTab");
  updateUI();
};
