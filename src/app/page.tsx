"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Clock, Filter, FileText, Check, Star, ArrowRight } from "lucide-react";
import { KidsDashboard } from "./components/KidsDashboard";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [childId, setChildId] = useState<string | null>(null);

  const handleAccessDemo = () => {
    // Criar dados de demonstração
    const demoChild = {
      id: "demo-child-1",
      name: "Maria",
      pin: "1234",
      screenTime: 45,
      timeLimit: 120,
      apps: [
        { id: "1", name: "YouTube Kids", timeLimit: 30, timeUsed: 15, blocked: false },
        { id: "2", name: "Duolingo", timeLimit: 45, timeUsed: 20, blocked: false },
        { id: "3", name: "Minecraft", timeLimit: 60, timeUsed: 10, blocked: false },
        { id: "4", name: "TikTok", timeLimit: 0, timeUsed: 0, blocked: true },
        { id: "5", name: "Instagram", timeLimit: 0, timeUsed: 0, blocked: true },
      ],
      routines: [
        { id: "1", time: "08:00", title: "Café da Manhã", description: "Hora de comer e se preparar para o dia!" },
        { id: "2", time: "14:00", title: "Lição de Casa", description: "Momento de estudar e fazer as tarefas" },
        { id: "3", time: "20:00", title: "Hora de Dormir", description: "Prepare-se para uma boa noite de sono" },
      ]
    };

    // Salvar no localStorage
    localStorage.setItem("parentalPro_children", JSON.stringify([demoChild]));
    
    setChildId(demoChild.id);
    setShowDashboard(true);
  };

  const handleCheckout = () => {
    // Redirecionar para página de checkout
    window.location.href = "/checkout";
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setChildId(null);
  };

  if (showDashboard && childId) {
    return <KidsDashboard childId={childId} onLogout={handleLogout} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Proteja o Futuro dos Seus Filhos com o ParentalPro!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              O Controle Parental Que Facilita a Vida dos Pais e Garante a Segurança dos Pequenos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleCheckout}
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Experimente Grátis por 30 Dias
              </Button>
              <Button 
                size="lg" 
                onClick={handleAccessDemo}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Ver Demo Interativa
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>

      {/* Introdução Impactante */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Você já se preocupou com o que seu filho está acessando na internet? Com o <span className="font-bold text-blue-600">ParentalPro</span>, esses medos podem ser coisa do passado! Nosso aplicativo de controle parental foi desenvolvido para proporcionar a você paz de espírito, enquanto seus filhos exploram o mundo digital.
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Benefícios do ParentalPro
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-blue-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Monitoramento em Tempo Real</h3>
              <p className="text-gray-600 text-center">
                Acompanhe a atividade online do seu filho em tempo real, garantindo que ele esteja sempre seguro.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-indigo-100">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Filter className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Filtros de Conteúdo</h3>
              <p className="text-gray-600 text-center">
                Bloqueie sites e aplicativos inapropriados com um simples toque.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-purple-100">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Limite de Tempo de Tela</h3>
              <p className="text-gray-600 text-center">
                Defina horários específicos para uso do celular e promova hábitos saudáveis.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-pink-100">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Relatórios Detalhados</h3>
              <p className="text-gray-600 text-center">
                Receba relatórios sobre as atividades online do seu filho diretamente no seu celular.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Depoimentos de Clientes Satisfeitos
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-4 text-lg">
              "O ParentalPro transformou minha rotina! Agora, sei exatamente o que meu filho faz online e me sinto muito mais tranquila."
            </p>
            <p className="font-bold text-gray-800">- Ana, mãe de dois</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-4 text-lg">
              "A interface é super fácil de usar! Nunca foi tão simples monitorar o que meu filho acessa."
            </p>
            <p className="font-bold text-gray-800">- Carlos, pai do Lucas</p>
          </Card>
        </div>
      </section>

      {/* Oferta Especial */}
      <section className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              🌟 Experimente Grátis por 30 Dias! 🌟
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Teste todas as funcionalidades do ParentalPro sem compromisso. Verifique como conseguimos transformar a segurança digital da sua família!
            </p>
            <Button 
              size="lg" 
              onClick={handleCheckout}
              className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-10 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
            >
              Experimente o ParentalPro Agora!
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Perguntas Frequentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-start">
              <Check className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              É fácil de instalar?
            </h3>
            <p className="text-gray-600 ml-8">
              Sim! O processo de instalação é simples e rápido. Você estará pronto em poucos minutos.
            </p>
          </Card>

          <Card className="p-6 border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-start">
              <Check className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              Posso usar em mais de um dispositivo?
            </h3>
            <p className="text-gray-600 ml-8">
              Sim! O ParentalPro permite monitorar até 5 dispositivos diferentes com uma única conta.
            </p>
          </Card>

          <Card className="p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-start">
              <Check className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
              O app funciona em todas as idades?
            </h3>
            <p className="text-gray-600 ml-8">
              Claro! O ParentalPro é ideal para crianças de todas as idades, ajudando a proteger seu conteúdo de acordo com o desenvolvimento do seu filho.
            </p>
          </Card>
        </div>
      </section>

      {/* Fechamento */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A internet pode ser um lugar maravilhoso, mas também é cheio de riscos.
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Com o ParentalPro, você pode garantir que seus filhos naveguem com segurança. Não deixe a proteção de quem você ama para depois. Junte-se a nós e faça a escolha certa!
            </p>
            <Button 
              size="lg" 
              onClick={handleCheckout}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-bold"
            >
              Comece Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 ParentalPro. Todos os direitos reservados. Protegendo famílias no mundo digital.
          </p>
        </div>
      </footer>
    </main>
  );
}
