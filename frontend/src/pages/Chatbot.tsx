import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageCircle, Send, Bot, User, Leaf, Mic, MicOff, Volume2, Image, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrop } from "@/contexts/CropContext";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  time: string;
  image?: string;
}

const botResponses: Record<string, Record<string, string>> = {
  en: {
    crop: "Based on your current soil analysis:\n\n🌾 **Top Recommendations:**\n1. **Wheat** - 95% match with your soil\n2. **Rice** - Good for your moisture levels\n3. **Maize** - Suitable NPK balance\n\n💡 **Tip:** With your pH of 6.5 and good moisture, wheat would give the best yield this season.",
    irrigate: "Based on your moisture sensor (55%):\n\n💧 **Current Status:** Good but decreasing\n⏰ **Recommendation:** Irrigate within 24-48 hours\n🌅 **Best Time:** Early morning (5-7 AM)\n\n💡 **Tip:** Morning irrigation reduces evaporation by 30%!",
    weather: "🌤️ **Weather Forecast (Next 7 Days):**\n\n• Mon-Tue: Sunny, 32-34°C\n• Wed-Thu: Partly cloudy, 28-30°C\n• Fri-Sat: Light rain expected\n• Sun: Clear skies, 31°C\n\n⚠️ **Advisory:** Complete any spraying before Wednesday.",
    fertilizer: "Based on your NPK levels (N:65, P:45, K:80):\n\n🌿 **Nitrogen:** Slightly low - Apply 20kg urea/acre\n🟠 **Phosphorus:** Good levels\n🔴 **Potassium:** Excellent\n\n💡 **Organic Option:** Vermicompost + neem cake",
    image: "📷 **Image Analysis:**\n\nI've analyzed your crop image. Here's what I found:\n\n🔍 **Observation:** The leaves appear healthy with good coloration.\n✅ **Status:** No visible signs of disease or pest damage.\n💡 **Recommendation:** Continue current care routine. Monitor for any changes.",
    default: "I understand your question. Based on your current farm data:\n\n• **Soil Health:** Good condition\n• **Moisture:** 55% (optimal)\n• **Temperature:** 28°C (suitable)\n\nCould you tell me more specifically what you'd like to know?",
  },
  hi: {
    crop: "आपके मिट्टी विश्लेषण के अनुसार:\n\n🌾 **सर्वोत्तम फसलें:**\n1. **गेहूं** - 95% उपयुक्त\n2. **धान** - नमी के लिए अच्छा\n3. **मक्का** - NPK संतुलन उचित",
    image: "📷 **छवि विश्लेषण:**\n\nमैंने आपकी फसल की छवि का विश्लेषण किया है:\n\n🔍 **अवलोकन:** पत्तियां स्वस्थ दिखती हैं।\n✅ **स्थिति:** कोई बीमारी नहीं दिखती।\n💡 **सुझाव:** वर्तमान देखभाल जारी रखें।",
    default: "मैं आपका प्रश्न समझ गया। आपके खेत के डेटा के अनुसार सहायता कर सकता हूं।",
  },
};

const Chatbot = () => {
  const { language, t } = useLanguage();
  const { selectedCrop, sensorData } = useCrop();
  
  const getInitialMessage = (): Message => ({
    id: 1,
    type: "bot",
    content: selectedCrop 
      ? `Namaste! 🌱 I see you're growing **${selectedCrop.name}** ${selectedCrop.imageEmoji}. I can help you with:\n\n• Watering schedules for ${selectedCrop.name}\n• Fertilizer recommendations\n• Pest and disease management\n• Weather-based advice\n\nYou can also **upload an image** of your crop and I'll analyze it for any issues!`
      : "Namaste! 🌱 I'm your Crop Advisor AI assistant. I can help you with:\n\n• Crop recommendations based on your soil\n• Irrigation and watering schedules\n• Fertilizer suggestions\n• Weather-based farming advice\n\n📷 **New:** Upload crop images for AI analysis!",
    time: "Just now",
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = selectedCrop 
    ? [`Best practices for ${selectedCrop.name}?`, "When should I irrigate?", "Fertilizer schedule?", "Pest control tips?"]
    : ["Which crop is best for my soil?", "When should I irrigate?", "Weather forecast?", "Fertilizer recommendation"];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const getBotResponse = (userMessage: string, hasImage: boolean): string => {
    if (hasImage) return botResponses[language]?.image || botResponses.en.image;
    const msg = userMessage.toLowerCase();
    const responses = botResponses[language] || botResponses.en;
    if (msg.includes("crop") || msg.includes("plant")) return responses.crop || responses.default;
    if (msg.includes("irrigat") || msg.includes("water")) return responses.irrigate || responses.default;
    if (msg.includes("weather") || msg.includes("rain")) return responses.weather || responses.default;
    if (msg.includes("fertiliz") || msg.includes("npk")) return responses.fertilizer || responses.default;
    return responses.default;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = (content: string) => {
    if (!content.trim() && !selectedImage) return;
    
    const userMessage: Message = { 
      id: messages.length + 1, 
      type: "user", 
      content: content.trim() || "Analyze this image", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: selectedImage || undefined 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const hadImage = !!selectedImage;
    setSelectedImage(null);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = { 
        id: messages.length + 2, 
        type: "bot", 
        content: getBotResponse(content, hadImage), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-semibold text-foreground">{t("cropAdvisorAI")}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-leaf rounded-full animate-pulse" />
                  {t("onlineMultilingual")}
                  {selectedCrop && <span className="text-primary">• {selectedCrop.imageEmoji} {selectedCrop.name}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-card rounded-2xl shadow-md flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3 animate-slide-up", message.type === "user" && "flex-row-reverse")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", message.type === "bot" ? "bg-primary" : "bg-accent")}>
                  {message.type === "bot" ? <Bot className="w-5 h-5 text-primary-foreground" /> : <User className="w-5 h-5 text-accent-foreground" />}
                </div>
                <div className={cn("max-w-[80%] p-4 rounded-2xl", message.type === "bot" ? "bg-muted rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none")}>
                  {message.image && <img src={message.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2 max-h-48 object-cover" />}
                  <div className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={j}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={cn("flex items-center gap-2 mt-2", message.type === "bot" ? "text-muted-foreground" : "text-primary-foreground/70")}>
                    <span className="text-xs">{message.time}</span>
                    {message.type === "bot" && <button className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"><Volume2 className="w-3 h-3" /></button>}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Bot className="w-5 h-5 text-primary-foreground" /></div>
                <div className="bg-muted p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedImage && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <div className="relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-20 rounded-lg object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">{t("quickQuestions")}:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button key={question} onClick={() => sendMessage(question)} className="px-3 py-2 bg-card text-foreground rounded-lg text-sm whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors border border-border">
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-4 border-t border-border">
            <div className="flex gap-3">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" title={t("uploadImage")}>
                <Image className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => setIsListening(!isListening)} className={cn("p-3 rounded-xl transition-colors", isListening ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("askAnything")} className="flex-1 px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base" />
              <Button type="submit" disabled={(!input.trim() && !selectedImage) || isTyping} className="px-4"><Send className="w-5 h-5" /></Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
