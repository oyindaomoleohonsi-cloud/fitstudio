export interface InitResult { authorization_url: string; reference: string }
export interface PaymentProvider {
  name: string;
  initialize(email: string, amountKobo: number): Promise<InitResult>;
  verify(reference: string): Promise<{ paid: boolean }>;
}

// Paystack: free integration, T+1 settlement. Server-side verify before granting value.
export class PaystackProvider implements PaymentProvider {
  name = "paystack";
  async initialize(email: string, amountKobo: number): Promise<InitResult> {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) return { authorization_url: "#mock-paystack-no-key", reference: "mock-ref" };
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: amountKobo }),
    });
    const j = await res.json();
    return { authorization_url: j.data.authorization_url, reference: j.data.reference };
  }
  async verify(reference: string) {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) return { paid: false };
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const j = await res.json();
    return { paid: j.data?.status === "success" };
  }
}

export function getPaymentProvider(): PaymentProvider { return new PaystackProvider(); }
