export interface Question {
  question: string;
  answer: string;
}

export const questions: Question[] = [
  {
question: "How does this work?",
answer: 'Choose the amount you would like to mint and click "Mint Now". We will inscribe them and send you the next available NFT IDs. Items are inscribed on payment receipt. Note: Lightning payment will be processed instantly.'
  },
  {
question: "What if I mint late?",
answer: "We do not guarantee any inscription numbers or NFT ids. It's first come first serve. If an order is placed and mint ends before payment is settled, we will provide refunds."
  },
  {
    question: "Should I use Bitcoin onchain or Lightning Network to pay?",
    answer: `We recommend that you use Lightning to pay for the inscription as they are instant and free. On chain Bitcoin payments can take much longer as they need to wait for 1-confirmation on Bitcoin.
You can use Cash App , Wallet of Satoshi or any other Lightning wallet to pay Lightning invoices.`,
  },
  {
    question: "Can I pay from an exchange?",
    answer:
      "Yes, however, please remember that all exchanges take a fee, so you will need to compensate for this and make sure you send the correct amount shown on the invoice.",
  },
  {
    question: "What wallets can I use to pay?",
    answer:
      "You can use any BTC or Lightning wallet. The wallet you use to pay does not need to be the same as the one we sent your inscription to.",
  },
  {
    question: "What to do if I have underpaid for an order?",
    answer:
      "If you underpay due to any reason (exchange fees, miner fees etc.) your order status will show as underpaid and you'll be able to complete the payment or take a refund by following the link in the order checker.",
  },
  {
    question: "Can I receive multiple ordinals to 1 address?",
    answer:
      "It's perfectly fine to receive multiple ordinals to 1 address. You just need to be careful about doing coin control and making sure ordinals are safe when they're being moved.",
  },
  {
    question: "I paid, where is my inscription?",
    answer:
      "When your payment is confirmed, the bot will inscribe your Ordinal to an internal wallet, your order will then go into the delivery phase. You can use the order checker to see the current status of the delivery and set receive address if you haven't already.",
  },
  {
    question: "How do I check the status of my order?",
    answer: `You can use the Check order status button to check your order status

      OR
      
      On the main page of ordinalsbot.com, there is a form where you can input your order number to check the status of your order and set receive address if you haven't already.`,
  },
  {
    question: "What if I lost my order number?",
    answer:
      "If you lose your order number and need it to check your order, you will need to contact the Ordinalsbot.com team on Discord.",
  },
  {
    question: "Why is it taking so long to receive my inscription?",
    answer:
      "We inscribe your ordinal immediately as soon as we receive your payment however bitcoin blockchain prioritizes higher fee transactions. So if you've selected a low fee you may need to wait for a long time for inscription transaction to confirm depending on the state of the bitcoin mempool.",
  },
];