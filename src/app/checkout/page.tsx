"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Lock, ArrowLeft, X, Crown } from "lucide-react";
import Link from "next/link";

type PlanType = "beta" | "premium";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("premium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular processamento
    setTimeout(() => {
      // Salvar plano selecionado no localStorage
      localStorage.setItem("parentalPro_plan", selectedPlan);
      alert(`Pagamento processado com sucesso! Bem-vindo ao ParentalPro ${selectedPlan === "premium" ? "Premium" : "Beta"}!`);
      window.location.href = "/";
      setLoading(false);
    }, 2000);
  };

  const plans = {
    beta: {
      name: "Beta",
      price: "Grátis",
      priceValue: 0,
      description: "Ideal para começar",
      features: [
        { text: "Monitoramento básico", included: true },
        { text: "Até 2 dispositivos", included: true },
        { text: "Controle de tempo de tela", included: true },
        { text: "Bloqueio de apps", included: true },
        { text: "Filtros de conteúdo avançados", included: false },
        { text: "Relatórios detalhados", included: false },
        { text: "Rotinas personalizadas", included: false },
        { text: "Suporte prioritário", included: false },
      ]
    },
    premium: {
      name: "Premium",
      price: "R$ 29,90",
      priceValue: 29.90,
      description: "Proteção completa",
      features: [
        { text: "Monitoramento em tempo real", included: true },
        { text: "Até 5 dispositivos", included: true },
        { text: "Controle de tempo de tela", included: true },
        { text: "Bloqueio de apps", included: true },
        { text: "Filtros de conteúdo avançados", included: true },
        { text: "Relatórios detalhados", included: true },
        { text: "Rotinas personalizadas", included: true },
        { text: "Suporte prioritário", included: true },
      ]
    }
  };

  const currentPlan = plans[selectedPlan];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para página inicial
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Escolha Seu Plano
          </h1>
          <p className="text-lg text-gray-600">
            Selecione o plano ideal para sua família e comece a proteger seus filhos hoje!
          </p>
        </div>

        {/* Seleção de Planos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Plano Beta */}
          <Card 
            className={`p-6 cursor-pointer transition-all duration-300 ${
              selectedPlan === "beta" 
                ? "border-4 border-blue-500 shadow-2xl scale-105" 
                : "border-2 border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setSelectedPlan("beta")}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Plano Beta</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === "beta" ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`}>
                {selectedPlan === "beta" && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">Grátis</div>
              <p className="text-gray-600">{plans.beta.description}</p>
            </div>
            <div className="space-y-3">
              {plans.beta.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Plano Premium */}
          <Card 
            className={`p-6 cursor-pointer transition-all duration-300 relative overflow-hidden ${
              selectedPlan === "premium" 
                ? "border-4 border-yellow-500 shadow-2xl scale-105" 
                : "border-2 border-gray-200 hover:border-yellow-300"
            }`}
            onClick={() => setSelectedPlan("premium")}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
              <Crown className="w-3 h-3" />
              RECOMENDADO
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Plano Premium</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === "premium" ? "border-yellow-500 bg-yellow-500" : "border-gray-300"
              }`}>
                {selectedPlan === "premium" && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                R$ 29,90
                <span className="text-sm text-gray-500 font-normal">/mês</span>
              </div>
              <p className="text-gray-600">{plans.premium.description}</p>
              <div className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full inline-block mt-2 font-semibold">
                30 dias grátis
              </div>
            </div>
            <div className="space-y-3">
              {plans.premium.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Pessoais */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    Informações Pessoais
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input id="firstName" placeholder="João" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input id="lastName" placeholder="Silva" required className="mt-1" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="joao@exemplo.com" required className="mt-1" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" placeholder="(11) 99999-9999" required className="mt-1" />
                  </div>
                </div>

                {/* Informações de Pagamento - Apenas para Premium */}
                {selectedPlan === "premium" && (
                  <div className="pt-6 border-t">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      Informações de Pagamento
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <div className="relative mt-1">
                          <Input 
                            id="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            required 
                            className="pl-10"
                          />
                          <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Validade</Label>
                          <Input id="expiry" placeholder="MM/AA" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required className="mt-1" maxLength={3} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input id="cardName" placeholder="JOÃO SILVA" required className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Segurança */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <Lock className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      {selectedPlan === "premium" ? "Pagamento 100% Seguro" : "Cadastro 100% Seguro"}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {selectedPlan === "premium" 
                        ? "Seus dados são criptografados e protegidos. Não armazenamos informações de cartão."
                        : "Seus dados pessoais são criptografados e protegidos. Comece grátis agora!"
                      }
                    </p>
                  </div>
                </div>

                {/* Botão de Submissão */}
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className={`w-full text-white text-lg py-6 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 ${
                    selectedPlan === "premium"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  {loading ? "Processando..." : selectedPlan === "premium" ? "Confirmar Assinatura Premium" : "Começar com Plano Beta"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>
              
              {/* Plano Selecionado */}
              <div className={`rounded-lg p-4 mb-6 border-2 ${
                selectedPlan === "premium"
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">Plano {currentPlan.name}</span>
                  {selectedPlan === "premium" && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      30 DIAS GRÁTIS
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {currentPlan.description}
                </p>
                <div className={`text-3xl font-bold ${selectedPlan === "premium" ? "text-yellow-600" : "text-blue-600"}`}>
                  {currentPlan.price}
                  {selectedPlan === "premium" && (
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      por 30 dias
                    </span>
                  )}
                </div>
                {selectedPlan === "premium" && (
                  <p className="text-xs text-gray-500 mt-2">
                    Depois R$ 29,90/mês. Cancele quando quiser.
                  </p>
                )}
              </div>

              {/* Benefícios Inclusos */}
              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">O que está incluso:</h3>
                {currentPlan.features.filter(f => f.included).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                {selectedPlan === "premium" ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-800">R$ 29,90</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-600 font-semibold">Desconto (30 dias grátis)</span>
                      <span className="font-semibold text-green-600">-R$ 29,90</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-gray-800 mt-4 pt-4 border-t">
                      <span>Total Hoje</span>
                      <span className="text-green-600">R$ 0,00</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-blue-600">Grátis</span>
                  </div>
                )}
              </div>

              {/* Garantia */}
              {selectedPlan === "premium" && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    🛡️ Garantia de 30 dias
                  </p>
                  <p className="text-xs text-yellow-700">
                    Não gostou? Cancele a qualquer momento sem custos.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Ao confirmar, você concorda com nossos{" "}
            <a href="#" className="text-blue-600 hover:underline">Termos de Serviço</a> e{" "}
            <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </main>
  );
}
