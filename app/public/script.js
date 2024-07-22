/* eslint-disable prettier/prettier */
async function sendTransaction() {
    const tss = "tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur";
    const contract = document.getElementById("contract").value.replace(/^0x/, "");
    if ( contract.length !== 40 ) return alert("Not a valid contract address");
    const message = document.getElementById("message").value.replace(/^0x/, "");
    const amount = parseFloat(document.getElementById("amount").value) * 1e8;
    if (isNaN(amount)) return alert("Amout must be number");
    const params = { contract, message, amount, tss};
    const wallet = document.getElementById("walletSelect")?.value;
    switch (wallet) {
        case "unisat":
            await useUnisat(params);
            break;
        case "xdefi":
            await useXDEFI(params);
            break;
    }

}

async function useXDEFI(p){
    if (!window.xfi) return alert("XDEFI wallet nor installed");
    const wallet = window.xfi;
    window.xfi.bitcoin.changeNetwork("testnet");
    const account = (await wallet?.bitcoin?.getAccounts())?.[0];
    if (!account) return alert("No account found");
    const tx = {
        method: "transfer",
        params: [
            {
                feeRate: 10,
                from: account,
                recipient: p.tss,
                amount: {
                    amount: p.amount,
                    decimals: 8,
                },
                memo: `hex::${p.contract}${p.message}`,
            },
        ]
    };
    window.xfi.bitcoin.request(tx, (err, res) => {
        if (e) {
            return alert(`Couldn't send transaction, ${JSON.stringify(err)}`);
        }
        else if (res) {
            return alert(`Broadcasted a transaction, ${JSON.stringify(res)}`);
        }
    })
}

async function useUnisat(p) {
    if (!window.unisat) return alert("Unisat wallet not installed");
    try {
      await window.unisat.requestAccounts();
      const memos = [`${p.contract}${p.message}`.toLowerCase()];
      const tx = await unisat.sendBitcoin(p.tss, p.amount, { memos });
      return alert(`Broadcasted a transaction: ${JSON.stringify(tx)}`);
    } catch (e) {
      return alert(`Couldn't send transaction, ${JSON.stringify(e)}`);
    }
  }

  