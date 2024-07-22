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